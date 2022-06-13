import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Validator from "validator";
import { setSum, setShareType, setRecurring } from "../../../store/donation/actions";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { State } from "../../../store/state";
import { RecurringDonation, ShareType } from "../../../types/Enums";
import { SharesSelection } from "./ShareSelection";
import { ActionBar, SumButtonsWrapper, SumWrapper } from "./DonationPane.style";
import { SharesSum } from "./SharesSum";
import { nextPane } from "../../../store/layout/actions";
import { EffektButton, EffektButtonType } from "../../../../elements/effektbutton";
import { RadioButtonGroup } from "../../../../elements/radiobuttongroup";
import { NextButton } from "../../shared/Buttons/NavigationButtons.style";

export const DonationPane: React.FC = () => {
  const dispatch = useDispatch();
  const donation = useSelector((state: State) => state.donation);

  const suggestedSums = [350, 500, 850];

  function onSubmit() {
    dispatch(nextPane());
  }

  return (
    <Pane>
      <PaneContainer>
        <div>
          <PaneTitle>Hvor mye ønsker du å Gi Effektivt?</PaneTitle>
          <RadioButtonGroup
            options={[
              { title: "Gi månedlig", value: RecurringDonation.RECURRING },
              { title: "Engangsbeløp", value: RecurringDonation.NON_RECURRING },
            ]}
            selected={donation.recurring}
            onSelect={(option) => dispatch(setRecurring(option as RecurringDonation))}
          />

          <SumButtonsWrapper>
            {suggestedSums.map((sum) => (
              <div key={sum}>
                <EffektButton
                  type={EffektButtonType.SECONDARY}
                  onClick={() => dispatch(setSum(sum))}
                >{`${sum} kr`}</EffektButton>
                {sum == suggestedSums[suggestedSums.length - 1] && <i>Snittdonasjon</i>}
              </div>
            ))}
          </SumButtonsWrapper>
          <SumWrapper>
            <label htmlFor="sum">Velg et eget beløp</label>
            <span>
              <input
                name="sum"
                type="tel"
                placeholder="0"
                value={donation.sum && donation.sum > 0 ? donation.sum : ""}
                autoComplete="off"
                onChange={(e) => {
                  if (Validator.isInt(e.target.value) === true && parseInt(e.target.value) > 0) {
                    dispatch(setSum(parseInt(e.target.value)));
                  } else {
                    dispatch(setSum(-1));
                  }
                }}
              />
            </span>
          </SumWrapper>

          <RadioButtonGroup
            options={[
              { title: "Bruk anbefalt fordeling", value: ShareType.STANDARD },
              { title: "Jeg vil velge selv", value: ShareType.CUSTOM },
            ]}
            selected={donation.shareType}
            onSelect={(option) => {
              dispatch(setShareType(option as ShareType));
            }}
          />

          {donation.shareType === ShareType.CUSTOM && (
            <div>
              <SharesSelection />
              <SharesSum />
            </div>
          )}
        </div>

        <ActionBar>
          <NextButton
            disabled={!donation.isValid}
            onClick={() => {
              onSubmit();
            }}
          >
            Neste
          </NextButton>
        </ActionBar>
      </PaneContainer>
    </Pane>
  );
};