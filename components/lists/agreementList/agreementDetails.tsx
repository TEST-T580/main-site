import React, { useContext, useEffect, useState } from "react";
import style from "../../../styles/AgreementDetails.module.css"
import { Distribution } from "../../../models";
import { DistributionController } from "../../elements/distribution";
import { DatePickerInput } from "../../elements/datepickerinput";
import { toast } from "react-toastify";
import { updateAvtaleagreementAmount, updateAvtaleagreementPaymentDay, updateAvtalegiroAgreementDistribution, updateVippsAgreementDay, updateVippsAgreementDistribution, updateVippsAgreementPrice } from "./_queries";
import { useAuth0, User } from "@auth0/auth0-react";
import { useSWRConfig } from "swr";
import { AlertCircle, Check } from "react-feather";

export const AgreementDetails: React.FC<{ type: 'vipps' | 'avtalegiro', inputSum: number, inputDate: number, inputDistribution: Distribution, endpoint: string }> = ({ type, inputSum, inputDate, inputDistribution, endpoint }) => {
  const { getAccessTokenSilently, user } = useAuth0()
  const { mutate } = useSWRConfig()
  const [distribution, setDistribution] = useState<Distribution>(inputDistribution)
  const [day, setDay] = useState(inputDate)
  const [sum, setSum] = useState(inputSum.toFixed(0))

  const save = async () => {
    const token = await getAccessTokenSilently()
    if (type == 'vipps') {
      const savedDistributionKID = await updateVippsAgreementDistribution(endpoint, distribution, token)
      const updatedDate = await updateVippsAgreementDay(endpoint, day, token)
      const updatedSum = await updateVippsAgreementPrice(endpoint, parseFloat(sum), token)
      if (savedDistributionKID != null && updatedDate !== null && updatedSum !== null) {
        successToast()
        mutate(`/donors/${(user as User)["https://konduit.no/user-id"]}/recurring/vipps/`)
      } else {
        failureToast()
      }
    } else if (type == 'avtalegiro') {
      const savedDistributionKID = await updateAvtalegiroAgreementDistribution(endpoint, distribution, token)
      const updatedDate = await updateAvtaleagreementPaymentDay(endpoint, day, token)
      const updatedSum = await updateAvtaleagreementAmount(endpoint, parseFloat(sum)*100, token)
      if (savedDistributionKID != null && updatedDate !== null && updatedSum !== null) {
        successToast()
        mutate(`/donors/${(user as User)["https://konduit.no/user-id"]}/recurring/avtalegiro/`)
      } else {
        failureToast()
      }
    }
  }
  
  return (
    <div className={style.wrapper}>
      <div className={style.distribution}>
        <DistributionController distribution={distribution} onChange={(dist) => setDistribution(dist)} />
      </div>
      <div className={style.values}>
        <DatePickerInput selected={day} onChange={(date) => setDay(date)} />
        <input type="text" defaultValue={sum} onChange={(e) => setSum(e.target.value)} />
      </div>
      <div className={style.actions}>
        <button className={style.button}>Avslutt avtale</button>
        <button className={style.button} onClick={() => save()}>Lagre</button>
      </div>
    </div>
  )
}

const successToast = () => toast.success("Lagret", { icon: <Check size={24} color={'black'}/> });
const failureToast = () => toast.error("Noe gikk galt", { icon: <AlertCircle size={24} color={'black'}/> });