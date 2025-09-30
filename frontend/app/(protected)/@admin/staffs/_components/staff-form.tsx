import { CountrySelection } from "@/components/common/form/CountrySelection";
import { DatePicker } from "@/components/common/form/DatePicker";
import { InputTelNumber } from "@/components/common/form/InputTel";
import { PasswordInput } from "@/components/common/form/PasswordInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { Country } from "@/types/country";
import { CountryCode } from "libphonenumber-js";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function StaffForm({
  form,
  defaultCountry,
  defaultPhone,
}: {
  form: any;
  defaultCountry?: Country | null;
  defaultPhone?: string;
}) {
  const { t } = useTranslation();
  const params = useParams();
  const { deviceLocation } = useAuth();

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        {/* first name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>{t("First name")}</FormLabel>
              <FormControl>
                <Input type="text" placeholder={t("First name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* last name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>{t("Last name")}</FormLabel>
              <FormControl>
                <Input type="text" placeholder={t("Last name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Gender */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel> {t("Gender")} </FormLabel>
            <FormControl>
              <RadioGroup
                defaultValue={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-12 gap-4"
              >
                <Label
                  data-selected={field.value === "male"}
                  className="relative col-span-12 flex h-12 items-center space-x-2.5 rounded-md border-2 border-accent bg-accent px-4 py-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected sm:col-span-6"
                >
                  <RadioGroupItem value="male" className="absolute opacity-0" />
                  <span>{t("Male")}</span>
                </Label>

                <Label
                  data-selected={field.value === "female"}
                  className="relative col-span-12 flex h-12 items-center space-x-2.5 rounded-md border-2 border-accent bg-accent px-4 py-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected sm:col-span-6"
                >
                  <RadioGroupItem
                    value="female"
                    className="absolute opacity-0"
                  />
                  <span>{t("Female")}</span>
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Email")}</FormLabel>
            <FormControl>
              <Input type="email" placeholder={t("Email address")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date of birth */}
      <FormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Date of birth")}</FormLabel>
            <FormControl>
              <DatePicker {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>{t("Phone")}</FormLabel>
            <FormControl>
              <InputTelNumber
                value={defaultPhone}
                onChange={field.onChange}
                onBlur={(error: string) => {
                  if (error) {
                    form.setError("phone", {
                      type: "custom",
                      message: error,
                    });
                  } else {
                    form.clearErrors("phone");
                  }
                }}
                options={{
                  initialCountry: deviceLocation?.countryCode as CountryCode,
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password */}
      <div className="grid grid-cols-12 gap-4">
        <FormField
          control={form.control}
          name={params.staffId ? "newPassword" : "password"}
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel> {t("Password")} </FormLabel>
              <FormControl>
                <PasswordInput placeholder={t("Password")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* confirm password */}
        {!params.staffId && (
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem className="col-span-12">
                <FormLabel> {t("Confirm password")} </FormLabel>
                <FormControl>
                  <PasswordInput placeholder={t("Password")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Address */}
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="addressLine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Address")}</FormLabel>
              <FormControl>
                <Input type="text" placeholder={t("Address line")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CountrySelection
                  defaultValue={defaultCountry}
                  onSelectChange={(country) => {
                    field.onChange(country.code.cca2);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-6">
                <FormControl>
                  <Input type="text" placeholder={t("City")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-6">
                <FormControl>
                  <Input type="text" placeholder={t("Zip code")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
