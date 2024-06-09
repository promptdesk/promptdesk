import React, { useEffect } from "react";
import Warning from "./Alerts/Warning";
import PlaygroundButton from "./Form/PlaygroundButton";
import { organizationStore } from "@/stores/OrganizationStore";
import Success from "./Alerts/Success";
import InputField from "./Form/InputField";

const SSOSettings: React.FC = () => {
  const { isSSO, fetchIsSSO, saveSSO, organization } =
    organizationStore.getState();
  const [clientID, setClientID] = React.useState("");
  const [redirectEndpoint, setRedirectEndpoint] = React.useState(
    (process.env.PROMPT_SERVER_URL || window.location.origin) + "/auth/sso",
  );
  const [authorizationEndpoint, setAuthorizationEndpoint] = React.useState("");
  const [tokenEndpoint, setTokenEndpoint] = React.useState("");
  const [scopes, setScopes] = React.useState("");
  const [provider, setProvider] = React.useState("");

  useEffect(() => {
    fetchIsSSO();
    if (organization && organization.sso && organization.sso.length > 0) {
      setClientID(organization.sso[0].client_id);
      setAuthorizationEndpoint(organization.sso[0].authorization_endpoint);
      setTokenEndpoint(organization.sso[0].token_endpoint);
      setScopes(organization.sso[0].scopes);
      setProvider(organization.sso[0].provider);
    }
  }, []);

  async function updateSSO() {
    await saveSSO({
      client_id: clientID,
      authorization_endpoint: authorizationEndpoint,
      token_endpoint: tokenEndpoint,
      scopes,
      provider,
      redirect_endpoint: redirectEndpoint,
    });
    //reload page
    window.location.reload();
  }

  return (
    <div>
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        SSO Settings
      </h1>
      {isSSO !== true && (
        <Warning text="To fully enable this optional feature, you must set SSO_CLIENT_SECRET as an environemnt variable." />
      )}
      {isSSO === true && (
        <>
          <Success text="SSO enabled. SSO_CLIENT_SECRET is set." />
          <br />
          <InputField
            label="Provider"
            value={provider}
            onInputChange={(value) => setProvider(value)}
          />
          <br />
          <InputField
            label="Redirect Endpoint"
            value={redirectEndpoint}
            onInputChange={(value) => setRedirectEndpoint(value)}
          />
          <br />
          <InputField
            label="Client ID"
            value={clientID}
            onInputChange={(value) => setClientID(value)}
          />
          <br />
          <InputField
            label="Authorization Endpoint"
            value={authorizationEndpoint}
            onInputChange={(value) => setAuthorizationEndpoint(value)}
          />
          <br />
          <InputField
            label="Token Endpoint"
            value={tokenEndpoint}
            onInputChange={(value) => setTokenEndpoint(value)}
          />
          <br />
          <InputField
            label="Scopes (comma or space seperated)"
            value={scopes}
            onInputChange={(value) => setScopes(value)}
          />
          <br />
          <PlaygroundButton text="Update" onClick={updateSSO} />
        </>
      )}
    </div>
  );
};

export default SSOSettings;

