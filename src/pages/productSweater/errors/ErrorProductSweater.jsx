import { useRouteError } from "react-router-dom";

export default function () {
  const routeError = useRouteError()
  return (
    <div>
      <h1>une erreur s'est produite {routeError.toString()}</h1>
    </div>
  );
}
