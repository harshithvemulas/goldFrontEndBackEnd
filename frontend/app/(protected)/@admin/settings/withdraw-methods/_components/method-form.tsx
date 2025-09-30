import { CountrySelection } from "@/components/common/form/CountrySelection";
import { FileInput } from "@/components/common/form/FileInput";
import { ImageIcon } from "@/components/icons/ImageIcon";
import { Button } from "@/components/ui/button";
import {
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
import { useCurrencies } from "@/data/useCurrencies";
import { imageURL } from "@/lib/utils";
import { Currency } from "@/types/currency";
import { LucideMinus, LucidePlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MethodForm({
  form,
  logoImage,
}: {
  form: any;
  logoImage?: any;
}) {
  const { currencies, isLoading } = useCurrencies();
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="uploadLogo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Method logo")}</FormLabel>
            <FormControl>
              <FileInput
                id="uploadLogo"
                defaultValue={imageURL(logoImage)}
                onChange={(file) => field.onChange(file)}
                className="flex aspect-square h-[160px] w-[160px] items-center justify-center border-dashed border-primary bg-transparent"
              >
                <div className="flex flex-col items-center gap-2.5">
                  <ImageIcon />
                  <p className="text-sm font-normal text-primary">
                    {t("Upload logo")}
                  </p>
                </div>
              </FileInput>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Name")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("Method name")}
                type="text"
                className="disabled:bg-input"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="countryCode"
        render={({ field }) => (
          <FormItem className="col-span-12">
            <FormLabel>{t("Country")}</FormLabel>
            <FormControl>
              <CountrySelection
                allCountry
                onSelectChange={(country) => field.onChange(country.code.cca2)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="currencyCode"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Currency")}</FormLabel>
            <FormControl>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="text-base disabled:bg-input">
                  <SelectValue placeholder={t("Select currency")} />
                </SelectTrigger>
                <SelectContent>
                  {!isLoading &&
                    currencies?.map((currency: Currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="active"
        control={form.control}
        render={({ field }) => (
          <FormItem className="space-y-auto flex flex-row items-center gap-2">
            <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[130px] py-0 text-sm font-semibold">
              {t("Active")}
            </Label>
            <FormControl>
              <Switch
                defaultChecked={!!field.value}
                onCheckedChange={field.onChange}
                className="disabled:opacity-100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="recommended"
        control={form.control}
        render={({ field }) => (
          <FormItem className="space-y-auto flex flex-row items-center gap-2">
            <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[130px] py-0 text-sm font-semibold">
              {t("Recommended")}
            </Label>
            <FormControl>
              <Switch
                defaultChecked={!!field.value}
                onCheckedChange={field.onChange}
                className="disabled:opacity-100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <FormField
        name="minAmount"
        control={form.control}
        render={({ field }) => (
          <FormItem className="mt-2">
            <FormLabel>
              {t("Minimum amount")}
              {form.watch("currencyCode") && ` (${form.watch("currencyCode")})`}
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="300"
                className="disabled:bg-input"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="maxAmount"
        control={form.control}
        render={({ field }) => (
          <FormItem className="mt-2">
            <FormLabel>
              {t("Maximum amount")}
              {form.watch("currencyCode") && ` (${form.watch("currencyCode")})`}
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="3200000"
                className="disabled:bg-input"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="fixedCharge"
        control={form.control}
        render={({ field }) => (
          <FormItem className="mt-2">
            <FormLabel>
              {t("Fixed charge")}
              {form.watch("currencyCode") && ` (${form.watch("currencyCode")})`}
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="300"
                className="disabled:bg-input"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="percentageCharge"
        control={form.control}
        render={({ field }) => (
          <FormItem className="mt-2">
            <FormLabel>{t("Percentage charge (%)")}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="300"
                className="disabled:bg-input"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <div className="withdraw-method-repeater">
        <h3 className="mb-3">{t("Method Fields")}</h3>
        <div className="controls mb-3 flex gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              form.setValue("params", [
                ...(form.watch("params") || []),
                {
                  name: "",
                  label: "",
                  type: "text",
                  required: false,
                },
              ]);
            }}
          >
            {t("Add")}
            <LucidePlus size={20} />
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              form.setValue("params", form.watch("params")?.slice(0, -1));
            }}
          >
            {t("Remove")}
            <LucideMinus size={20} />
          </Button>
        </div>
        <div className="params-fields">
          {form.watch("params")?.map((_: any, index: number) => (
            <div
              className="repeater-field-single mb-6 grid grid-cols-4 gap-6"
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            >
              <FormField
                name={`params.${index}.name`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>{t("Name (Unique)")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Field Name"
                        className="disabled:bg-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`params.${index}.label`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>{t("Label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Field Label"
                        className="disabled:bg-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`params.${index}.type`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>{t("Type")}</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="disabled:bg-input">
                          <SelectValue placeholder={t("Field type")} />
                        </SelectTrigger>
                        <SelectContent>
                          {["text", "number"]?.map((currency: any) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`params.${index}.required`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-auto flex flex-col gap-2">
                    <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[130px] py-0 text-sm font-semibold">
                      {t("Required")}
                    </Label>
                    <FormControl>
                      <Switch
                        defaultChecked={!!field.value}
                        onCheckedChange={field.onChange}
                        className="disabled:opacity-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
