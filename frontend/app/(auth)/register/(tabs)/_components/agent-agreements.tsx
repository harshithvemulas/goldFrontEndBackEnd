import { AuthPageHeading } from "@/app/(auth)/_components/heading";
import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator";
import { useBranding } from "@/hooks/useBranding";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

interface IProps {
  title: string;
  subTitle: string;
  onPrev: () => void;
  onSubmit: (values: TFormData) => void;
  nextButtonLabel?: string;
  isLoading?: boolean;
  formData: Record<string, unknown>;
}

const formSchema = z.object({
  rechargeAgreement: z.string({ required_error: "This field is required." }),
  honestyAgreement: z.string({ required_error: "This field is required." }),
  fundingByAgentAccount: z.string({
    required_error: "This field is required.",
  }),
  amount: z.string({ required_error: "This field is required." }),
  customAmount: z.string().optional(),
});

type TFormData = z.infer<typeof formSchema>;
export type TAgentAgreement = TFormData;

export function AgentAgreements({
  onPrev,
  onSubmit,
  title,
  subTitle,
  nextButtonLabel,
  isLoading = false,
  formData,
}: IProps) {
  const { defaultCurrency } = useBranding();
  const { t } = useTranslation();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rechargeAgreement: "Yes",
      honestyAgreement: "Yes",
      fundingByAgentAccount: "Yes",
      amount: "",
      customAmount: "",
    },
  });

  const isAgree = () => {
    const d = form.watch();
    if (
      d.rechargeAgreement === "Yes" &&
      d.honestyAgreement === "Yes" &&
      d.fundingByAgentAccount === "Yes"
    ) {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    if (formData) {
      form.reset({ ...formData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AuthPageHeading {...{ title, subTitle }} />

        <div className="my-6 flex h-[5px] items-center">
          <Separator className="bg-divider" />
        </div>

        <div className="flex flex-col gap-6">
          {/* Merchant name */}
          <FormField
            control={form.control}
            name="rechargeAgreement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    "You must be always available to recharge account for our customers, do you agree?",
                  )}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="grid-cols-12 gap-4"
                  >
                    <Label
                      htmlFor="rechargeAgreement"
                      data-active={field.value === "Yes"}
                      className="col-span-12 flex h-12 cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-input-disabled p-4 text-sm font-semibold leading-5 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                    >
                      <RadioGroupItem
                        id="rechargeAgreement"
                        value="Yes"
                        className="absolute left-0 top-0 opacity-0"
                      />
                      <span>{t("Yes")}</span>
                    </Label>

                    <Label
                      htmlFor="rechargeAgreementNo"
                      data-active={field.value === "No"}
                      className="col-span-12 flex h-12 cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-secondary-500 p-4 text-sm font-semibold leading-5 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                    >
                      <RadioGroupItem
                        id="rechargeAgreementNo"
                        value="No"
                        className="absolute left-0 top-0 opacity-0"
                      />
                      <span>{t("No")}</span>
                    </Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="honestyAgreement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("You must be honest, do you agree?")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="grid-cols-12 gap-4"
                  >
                    <Label
                      htmlFor="honestyAgreementYes"
                      data-active={field.value === "Yes"}
                      className="col-span-12 flex h-12 cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-secondary-500 p-4 text-sm font-semibold leading-5 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                    >
                      <RadioGroupItem
                        id="honestyAgreementYes"
                        value="Yes"
                        className="absolute left-0 top-0 opacity-0"
                      />
                      <span>{t("Yes")}</span>
                    </Label>

                    <Label
                      htmlFor="honestyAgreementNo"
                      data-active={field.value === "No"}
                      className="col-span-12 flex h-12 cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-secondary-500 p-4 text-sm font-semibold leading-5 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                    >
                      <RadioGroupItem
                        id="honestyAgreementNo"
                        value="No"
                        className="absolute left-0 top-0 opacity-0"
                      />
                      <span>{t("No")}</span>
                    </Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fundingByAgentAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    "We provide funding for your AGENT account, you must be able to pay 50% of that amount to fund the customers, do you agree?",
                  )}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="grid-cols-12 gap-4"
                  >
                    <Label
                      htmlFor="fundingByAgentAccountYes"
                      data-active={field.value === "Yes"}
                      className="col-span-12 flex h-12 cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-secondary-500 p-4 text-sm font-semibold leading-5 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                    >
                      <RadioGroupItem
                        id="fundingByAgentAccountYes"
                        value="Yes"
                        className="absolute left-0 top-0 opacity-0"
                      />
                      <span>{t("Yes")}</span>
                    </Label>

                    <Label
                      htmlFor="fundingByAgentAccountNo"
                      data-active={field.value === "No"}
                      className="col-span-12 flex h-12 cursor-pointer items-center justify-start rounded-xl border-[3px] border-border bg-secondary-500 p-4 text-sm font-semibold leading-5 transition-all duration-300 ease-in-out hover:border-primary-selected hover:bg-primary-selected data-[active=true]:border-primary data-[active=true]:bg-primary-selected md:col-span-6"
                    >
                      <RadioGroupItem
                        id="fundingByAgentAccountNo"
                        value="No"
                        className="absolute left-0 top-0 opacity-0"
                      />
                      <span>{t("No")}</span>
                    </Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    `How much money do you want to start with? (${defaultCurrency})`,
                  )}
                </FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="placeholder:text-placeholder border-none bg-input placeholder:text-base placeholder:font-normal">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500000">500K</SelectItem>
                      <SelectItem value="1000000">1M</SelectItem>
                      <SelectItem value="5000000">5M</SelectItem>
                      <SelectItem value="10000000">10M</SelectItem>
                      <SelectItem value="custom">{t("Other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("amount") === "custom" && (
            <FormField
              control={form.control}
              name="customAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t(
                      `Enter the amount you want to start with (${defaultCurrency})`,
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="10000"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" type="button" onClick={onPrev}>
              <ArrowLeft2 size={24} />
              {t("Back")}
            </Button>

            <Button
              disabled={isLoading || !isAgree()}
              type="submit"
              className="w-[286px] text-base font-medium leading-[22px]"
            >
              <Case condition={!isLoading}>
                {nextButtonLabel}
                <ArrowRight2 size={16} />
              </Case>
              <Case condition={isLoading}>
                <Loader className="text-background" />
              </Case>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
