import Head from "next/head";
import { Layout } from "../../components/profile/layout";
import { LayoutPage } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { AgreementList } from "../../components/lists/agreementList/agreementList";
import { AvtaleGiroAgreement, Donation, VippsAgreement } from "../../models";
import { useApi } from "../../hooks/useApi";
import { Spinner } from "../../components/elements/spinner";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Children,
  Lightbox,
} from "../../components/profile/agreements/lightbox";

const Agreements: LayoutPage = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const {
    loading: avtaleGiroLoading,
    data: avtaleGiro,
    error: avtaleGiroError,
  } = useApi<AvtaleGiroAgreement[]>(
    `/donors/${
      user ? user["https://konduit.no/user-id"] : ""
    }/recurring/avtalegiro/`,
    "GET",
    "read:donations",
    getAccessTokenSilently
  );

  const {
    loading: vippsLoading,
    data: vipps,
    error: vippsError,
  } = useApi<VippsAgreement[]>(
    `/donors/${
      user ? user["https://konduit.no/user-id"] : ""
    }/recurring/vipps/`,
    "GET",
    "read:donations",
    getAccessTokenSilently
  );

  if (vippsLoading || avtaleGiroLoading || !vipps || !avtaleGiro)
    return <Spinner />;

  let vippsType = vipps.map((entry) => ({
    ID: entry.ID,
    status: entry.status,
    KID: entry.KID,
    date: entry.monthly_charge_day,
    amount: entry.amount,
    type: "Vipps",
  }));

  console.log(avtaleGiro);
  let giroType = avtaleGiro.map((entry) => ({
    ID: entry.ID,
    status: entry.active,
    KID: entry.KID,
    date: entry.payment_date,
    amount: entry.amount,
    type: "AvtaleGiro",
  }));

  const lightboxChildren: Children = {
    button: "Avslutt",
    heading: "Avslutt avtale",
    paragraph: [
      `Hvis du avslutter din betalingsavtale hos oss vil vi slutte å trekke deg.`,
      `Dersom du har en avtalegiro avtale og den har trekkdato nærmere enn 6 dager tilbake i tid 
    har vi allerede sendt melding til banksystemene om å trekke deg. Dette skyldes tregheter i 
    registrering av trekk hos bankene. Om du ønsker refusjon på denne donasjonen kan du ta kontakt på donasjon@gieffektivt.no`,
    ],
  };

  return (
    <>
      <Head>
        <title>Avtaler</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Faste avtaler</h1>
        <Lightbox children={lightboxChildren} />
        <AgreementList
          title={"Aktive"}
          agreements={[...giroType, ...vippsType]}
          supplemental={"Dette er dine aktive betalingsavtaler du har med oss"}
        />
        <AgreementList
          title={"Inaktive"}
          agreements={[...giroType, ...vippsType]}
          supplemental={
            "Dette er tidligere faste betalingsavtaler du har hatt med oss, som vi ikke lenger trekker deg for"
          }
        />
      </div>
    </>
  );
};

Agreements.layout = Layout;
export default Agreements;
