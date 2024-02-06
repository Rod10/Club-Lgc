const piste = {
  label: "PISTE",
  logo: "/images/svg/home_operation.svg",
  routes: [
    {
      label: "Voir les pistes",
      href: "/piste/list",
    },
  ],
};

const session = {
  label: "SESSION",
  logo: "/images/icons/worker.svg",
  routes: [
    {
      label: "Liste des sessions",
      href: "/session/list",
    }
  ],
};

module.exports = {
  piste,
  session
};
