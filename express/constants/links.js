const piste = {
  label: "PISTE",
  logo: "/images/track.png",
  routes: [
    {
      label: "Voir les pistes",
      href: "/piste/list",
    },
  ],
};

const session = {
  label: "SESSION",
  logo: "/images/timetable.png",
  routes: [
    {
      label: "Liste des sessions",
      href: "/session/list",
    },
  ],
};

module.exports = {
  piste,
  session,
};
