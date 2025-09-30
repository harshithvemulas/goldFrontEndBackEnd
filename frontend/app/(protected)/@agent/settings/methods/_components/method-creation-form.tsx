import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator";
import Switch from "@/components/ui/switch";
import { createMethod } from "@/data/settings/methods";
import { useSWR } from "@/hooks/useSWR";
import { startCase } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Method name is required."),
  currencyCode: z.string().min(1, "Currency code is required."),
  countryCode: z.string().min(1, "Country is required."),
  inputType: z.enum(["phone", "email", "other"]).optional(),
  requiredInput: z.boolean().optional().default(false),
  allowDeposit: z.boolean().optional().default(true),
  allowWithdraw: z.boolean().optional().default(true),
  value: z.string().optional(),
  otherName: z.string().optional(),
});

type TFormData = z.infer<typeof formSchema>;

export function MethodCreationForm({
  onMutate,
  close,
}: {
  onMutate: () => void;
  close: () => void;
}) {
  const { t } = useTranslation();
  const [isPending, startTransaction] = useTransition();
  // fetch currency list
  const { data, isLoading } = useSWR("/currencies");

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      currencyCode: "",
      countryCode: "",
      inputType: undefined,
      value: "",
      requiredInput: false,
      allowDeposit: true,
      allowWithdraw: true,
      otherName: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: TFormData) => {
    startTransaction(async () => {
      const res = await createMethod({
        ...values,
        inputType: values.inputType ?? "",
        value: values.value ?? "",
        requiredInput: values.requiredInput,
        allowDeposit: values.allowDeposit,
        allowWithdraw: values.allowWithdraw,
        otherName: values.otherName ?? "",
      });

      if (res.status) {
        onMutate();
        toast.success(res.message);
        close();
      } else {
        toast.error(t(res.message));
      }
    });
  };

  const onError = () => {
    toast.error(t("Something went wrong."));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-h-[80vh] overflow-y-auto overflow-x-hidden px-3 pb-6 sm:px-6"
      >
        <div className="flex flex-col gap-4">
          {/* Method name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>{t("Name")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("Enter method name")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>{t("Value")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("Enter method value")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* select Currency */}
          <FormField
            control={form.control}
            name="currencyCode"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>{t("Currency")}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Enter currency")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <div className="px-2.5 py-2">
                          <Loader />
                        </div>
                      ) : null}

                      {!isLoading &&
                        data?.data?.map(
                          (currency: {
                            id: number;
                            code: string;
                            name: string;
                          }) => (
                            <SelectItem
                              key={currency?.id}
                              value={currency?.code}
                            >
                              {currency.name} ({currency?.code})
                            </SelectItem>
                          ),
                        )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>{t("Country")}</FormLabel>
                <FormControl>
                  <CountrySelection
                    onSelectChange={(country) =>
                      field.onChange(country.code.cca2)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiredInput"
            render={({ field }) => (
              <FormItem className="px-2 py-5">
                <FormControl>
                  <Label className="flex items-center gap-2.5">
                    <Checkbox
                      id="requiredAdditionalField"
                      defaultChecked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        form.setValue("inputType", undefined);
                        form.setValue("otherName", "");
                      }}
                    />
                    <span> {t("Required additional field")} </span>
                  </Label>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Case condition={form.watch("requiredInput")}>
            <>
              {/* select Input type */}
              <FormField
                control={form.control}
                name="inputType"
                render={({ field }) => (
                  <FormItem className="px-2">
                    <FormLabel>{t("Input type")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select input type")} />
                        </SelectTrigger>
                        <SelectContent>
                          {["phone", "email", "other"].map((item) => (
                            <SelectItem key={item} value={item}>
                              {startCase(item)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Case condition={form.watch("inputType") === "other"}>
                {/* select other input field */}
                <FormField
                  control={form.control}
                  name="otherName"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>{t("Input name")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Write required field name")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Case>
            </>
          </Case>

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="allowDeposit"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Label className="w-36">{t("Allow Deposit")}</Label>
                    <Switch
                      defaultChecked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowWithdraw"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Label className="w-36">{t("Allow Withdraw")}</Label>
                    <Switch
                      defaultChecked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center">
          <Button disabled={isPending} type="submit" className="ml-auto mt-5">
            {!isPending ? (
              t("Create")
            ) : (
              <Loader
                title={t("Processing...")}
                className="text-primary-foreground"
              />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
