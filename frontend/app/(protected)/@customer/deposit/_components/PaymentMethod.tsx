import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight2 } from "iconsax-react";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TDepositFormData } from "../page";
import { MethodSelection } from "./MethodSelection";

interface IProps {
  form: UseFormReturn<TDepositFormData>;
  updateTab: () => void;
  onBack: () => void;
}

export function PaymentMethod({ form, updateTab, onBack }: IProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState("details");

  useEffect(() => {
    if (form.getValues("country")) {
      setActiveTab("agentSelection");
    }
  }, [form]);

  // verify field validation
  const onContinue = () => {
    if (!form.getValues("country")) {
      form.setError("country", {
        message: "Select a country to continue.",
        type: "required",
      });
    } else {
      setActiveTab("agentSelection");
    }
  };

  return (
    <>
      <Case condition={activeTab === "details"}>
        <div className="flex flex-col gap-y-4 md:gap-y-8">
          {/* Country of deposit */}
          <div className="flex flex-col gap-y-4">
            <h2>{t("Country of deposit")}</h2>
            <FormField
              name="country"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CountrySelection
                      defaultCountry={field.value}
                      onSelectChange={(country) => {
                        field.onChange(country?.code?.cca2);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action button */}
          <div className="mt-8 flex justify-end">
            <Button type="button" onClick={onContinue} className="min-w-48">
              <span>{t("Next")}</span>
              <ArrowRight2 size={16} />
            </Button>
          </div>
        </div>
      </Case>

      <Case condition={activeTab === "agentSelection"}>
        <MethodSelection
          form={form}
          changeCountry={() => setActiveTab("details")}
          onBack={onBack}
          onNext={updateTab}
        />
      </Case>
    </>
  );
}
