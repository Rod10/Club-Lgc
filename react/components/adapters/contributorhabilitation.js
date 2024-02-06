const React = require("react");

const dateFns = require("date-fns");
const FunctionsFull = require("../../../express/constants/functionsfull.js");
const HabilitationRoles = require("../../../express/constants/habilitationroles.js");
const HabilitationStates = require("../../../express/constants/habilitationstates.js");
const HabilitationTypes = require("../../../express/constants/habilitationtypes.js");
const {
  habilitationRoles,
  habilitationTypes,
} = require("../../langs/fr.json").constants;
const NotificationCmp = require("../bulma/notification.js");

const formatDate = date => dateFns.format(new Date(date), "dd/MM/yyyy");

const getEmptyDataForType = () => ({
  cppDate: null,
  examDate: null,
  ips: "",
  modules: "",
});

const addContentFromCH = (tmp, contributorHabilitation) => {
  tmp.contributor = contributorHabilitation.contributor;
  tmp.contributorId = contributorHabilitation.contributorId;
  tmp.employer = contributorHabilitation.employer;
  tmp.employerId = contributorHabilitation.employerId;
  if (contributorHabilitation.serviceManager) {
    tmp.serviceManager = contributorHabilitation.serviceManager;
    tmp.serviceManagerId = contributorHabilitation.serviceManagerId;
  }
  tmp.habilitations = contributorHabilitation.habilitations
    .map(habilitation => {
      if (dateFns.isAfter(habilitation.validUntil, new Date())) return habilitation;
      const newHabilitation = {
        ...habilitation,
        validSince: null,
        validUntil: null,
      };
      delete newHabilitation.id;
      return newHabilitation;
    });
  tmp.data = Object.keys(contributorHabilitation.data).reduce((acc, cur) => {
    if (HabilitationTypes[cur]) {
      acc[cur] = contributorHabilitation.data[cur];
      if (acc[cur].physicalAptitudeDate) {
        if (!acc.physicalAptitudeDate) {
          acc.physicalAptitudeDate = acc[cur].physicalAptitudeDate;
        }
        delete acc[cur].physicalAptitudeDate;
      }
    } else if (cur === "physicalAptitudeDate") {
      acc[cur] = contributorHabilitation.data[cur];
    }
    return acc;
  }, tmp.data);
};

const getNewContributorHabilitation = (
  type = HabilitationTypes.ELECTRICITY,
  contributorHabilitation = null,
) => {
  const tmp = {
    id: null,
    contributor: null,
    contributorId: null,
    serviceManager: null,
    serviceManagerId: null,
    employer: null,
    employerId: null,
    state: HabilitationStates.CREATED,
    habilitations: [],
    data: {[type]: getEmptyDataForType(), physicalAptitudeDate: null},
    creationDate: null,
    updateDate: null,
  };
  if (contributorHabilitation) {
    addContentFromCH(tmp, contributorHabilitation);
  }
  return tmp;
};

const prepareHabilitation = entry => {
  const src = entry.toJSON ? entry.toJSON() : entry;
  return {
    ...src,
    validSince: new Date(src.validSince),
    validUntil: new Date(src.validUntil),
    creationDate: new Date(src.creationDate),
  };
};

const prepareContributorHabilitation = entry => {
  if (!entry) return null;
  const src = entry.toJSON ? entry.toJSON() : entry;
  const tmp = {
    ...src,
    habilitations: entry.habilitations
      ? entry.habilitations
        .sort((a, b) => a.sequence - b.sequence)
        .map(prepareHabilitation)
      : [],
    expirationDate: new Date(entry.expirationDate),
    creationDate: new Date(entry.creationDate),
    updateDate: new Date(entry.updateDate),
  };
  tmp.habilitations.forEach((e, i) => {
    e.sequence = i + 1;
  });
  tmp.data.physicalAptitudeDate = new Date(tmp.data.physicalAptitudeDate);
  if (isNaN(tmp.data.physicalAptitudeDate.getTime())) {
    tmp.data.physicalAptitudeDate = null;
  }
  Object.keys(tmp.data).forEach(dataKey => {
    if (HabilitationTypes[dataKey]) {
      tmp.data[dataKey].examDate = tmp.data[dataKey].examDate
        ? new Date(tmp.data[dataKey].examDate)
        : null;
      tmp.data[dataKey].cppDate = tmp.data[dataKey].cppDate
        ? new Date(tmp.data[dataKey].cppDate)
        : null;
      if (tmp.data[dataKey].physicalAptitudeDate) {
        if (tmp.data.physicalAptitudeDate === null
          || isNaN(tmp.data.physicalAptitudeDate.getTime())) {
          tmp.data.physicalAptitudeDate = new Date(tmp.data[dataKey].physicalAptitudeDate);
        }
        delete tmp.data[dataKey].physicalAptitudeDate;
      }
    }
  });
  if (tmp.data.sendHistory) {
    tmp.data.sendHistory = tmp.data.sendHistory.map(e => ({
      ...e,
      date: new Date(e.date),
    }));
  }
  tmp.validity = dateFns.differenceInYears(
    tmp.expirationDate,
    tmp.creationDate,
  ).toString();
  return tmp;
};

const validateHabilitations = (data, strict, errors = []) => {
  data.habilitations.forEach(habilitation => {
    const type = habilitationTypes[habilitation.type];
    const level = habilitation.level || "";
    const start = `L'habilitation ${type} de niveau ${level}`;
    if (!habilitation.level) {
      errors.push(`Une habilitation de type ${type} n'a pas de niveau sélectionné`);
    }
    if (!habilitation.validSince) errors.push(`${start} n'a pas de date de début`);
    if (!habilitation.validUntil) errors.push(`${start} n'a pas de date de fin`);
    if (strict && type === HabilitationTypes.AIPR) {
      if (!habilitation.examCenter) {
        errors.push(`${start} n'a pas de centre d'examen`);
      }
      if (!habilitation.examSession) {
        errors.push(`${start} n'a pas de N° d'examen`);
      }
    }
  });
  return errors;
};

const validateHabilitationData = (data, has3Signatures) => {
  const errors = [];
  if (has3Signatures && !data.serviceManagerId) {
    errors.push(`${habilitationRoles[HabilitationRoles.serviceManager]} non sélectionné`);
  }
  if (!data.employerId) {
    errors.push(`${habilitationRoles[HabilitationRoles.employer]} non sélectionné`);
  }
  if (data.habilitations.length === 0) {
    errors.push("Aucune habilitation sélectionnée");
  } else {
    validateHabilitations(data, true, errors);
  }
  if (!data.data.physicalAptitudeDate) {
    errors.push("Pas de date d'aptitude physique sélectionné");
  } else if (dateFns.isAfter(data.data.physicalAptitudeDate, new Date())) {
    errors.push("La date d'aptitude physique est dans le futur");
  }
  for (const key in data.data) {
    if (HabilitationTypes[key]) {
      const type = habilitationTypes[key];
      if (!data.data[key].examDate) {
        errors.push(`Pas de date de formation sélectionné pour ${type}`);
      } else if (dateFns.isAfter(data.data[key].examDate, new Date())) {
        errors.push(`La date de formation ${type} est dans le futur`);
      }
    }
  }
  return errors;
};

const columnRenders = {
  domain: {
    label: "Domaine de tension",
    render: habilitation => habilitation.domain,
  },
  examCenter: {
    label: "Centre d'examen",
    render: habilitation => habilitation.examCenter,
  },
  examSession: {
    label: "N° d'examen",
    render: habilitation => habilitation.examSession,
  },
  fonction: {
    label: "Fonction",
    render: habilitation => {
      if (!habilitation.cf) return null;
      const funcName = FunctionsFull[habilitation.cf.name].name;
      return habilitation.cf.id
        ? funcName
        : <NotificationCmp compact type="is-warning">{funcName}</NotificationCmp>;
    },
  },
  level: {
    label: "Niveau(x) d'habilitation",
    render: habilitation => habilitation.level,
  },
  ouvrage: {
    label: "Ouvrage / installation",
    render: habilitation => habilitation.ouvrage,
  },
  additionalInfos: {
    label: "Indication complémentaire",
    render: habilitation => habilitation.additionalInfos,
  },
  validityRange: {
    label: "Validité",
    render: habilitation => {
      if (habilitation.validSince && habilitation.validUntil) {
        /* eslint-disable-next-line max-len */
        return `du ${formatDate(habilitation.validSince)} au ${formatDate(habilitation.validUntil)}`;
      }
      return "Non défini";
    },
  },
  work: {
    label: "Travaux",
    render: (_, ref) => ref.work,
  },
  machineType: {
    label: "Type d'engins",
    render: (_, ref) => ref.work,
  },
  itst: {
    label: "ITST",
    render: habilitation => habilitation.itst || "",
  },
  workField: {
    label: "Dom. ouvrage / installation",
    render: habilitation => habilitation.workField?.join(", ") || "",
  },
};

module.exports = {
  columnRenders,
  getEmptyDataForType,
  getNewContributorHabilitation,
  prepareContributorHabilitation,
  validateHabilitations,
  validateHabilitationData,
};
