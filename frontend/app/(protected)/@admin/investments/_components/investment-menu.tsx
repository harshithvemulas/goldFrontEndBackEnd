import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { deleteInvestment } from "@/data/investments/deleteInvestment";
import { updateInvestment } from "@/data/investments/updateInvestment";
import { useSWR } from "@/hooks/useSWR";
import { startCase } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  interestRate: z.string({ required_error: "Interest rate is required" }),
  duration: z.string({ required_error: "Duration is required" }),
  durationType: z.string({ required_error: "Duration type is required" }),
  withdrawAfterMatured: z.string({
    required_error: "Withdraw after matured is required",
  }),
});

export type InvestmentFormData = z.infer<typeof formSchema>;

export function InvestmentMenu({
  investmentId,
  onMutate,
}: {
  investmentId: number | string;
  onMutate: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <EditInvestmentButton onMutate={onMutate} investmentId={investmentId} />
      <DeleteInvestmentButton onMutate={onMutate} investmentId={investmentId} />
    </div>
  );
}

function EditInvestmentButton({
  investmentId,
  onMutate,
}: {
  investmentId: number | string;
  onMutate: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const { data, isLoading } = useSWR(`/admin/investments/${investmentId}`);

  const investment = data?.data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      interestRate: "",
      duration: "",
      durationType: "",
      withdrawAfterMatured: "",
    },
  });

  useEffect(() => {
    if (investment?.id) {
      form.reset({
        name: investment.name,
        interestRate: String(investment.interestRate),
        duration: String(investment.duration),
        durationType: investment.durationType,
        withdrawAfterMatured: investment.withdrawAfterMatured ? "1" : "0",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investment?.id]);

  const onSubmit = (values: InvestmentFormData) => {
    startTransition(async () => {
      const res = await updateInvestment(investmentId, values);

      if (res?.status) {
        onMutate();
        setIsOpen(false);
        toast.success(t("Investment updated successfully"));
      } else {
        toast.error(t(res?.message));
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-md bg-background text-primary hover:bg-background"
        >
          <Edit2 size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Invest")}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormLabel>{t("Plan name")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Enter name for the investment plan")}
                        className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Duration (Days)")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Enter investment duration")}
                          className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Profit rate (Percentage)")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Enter a profit rate")}
                          className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="durationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Profit adjust")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="disabled:bg-input">
                          <SelectValue
                            placeholder={t("Select portfolio adjust")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {["daily", "weekly", "monthly", "yearly"].map(
                            (item: any) => (
                              <SelectItem key={item} value={item}>
                                {startCase(t(item))}
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

              <FormField
                control={form.control}
                name="withdrawAfterMatured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Withdraw After Matured")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        className="flex"
                      >
                        <Label
                          htmlFor="TypeYes"
                          data-selected={field.value === "1"}
                          className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                        >
                          <RadioGroupItem
                            id="TypeYes"
                            value="1"
                            className="absolute opacity-0"
                          />
                          <span>{t("Yes")}</span>
                        </Label>

                        <Label
                          htmlFor="TypeNo"
                          data-selected={field.value === "0"}
                          className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                        >
                          <RadioGroupItem
                            id="TypeNo"
                            value="0"
                            className="absolute opacity-0"
                          />
                          <span>{t("No")}</span>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  {t("Cancel")}
                </Button>
                <Button type="submit">
                  <Case condition={isPending}>
                    <Loader
                      title={t("Processing...")}
                      className="text-primary-foreground"
                    />
                  </Case>
                  <Case condition={!isPending}>{t("Update")}</Case>
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
function DeleteInvestmentButton({
  investmentId,
  onMutate,
}: {
  investmentId: number | string;
  onMutate: () => void;
}) {
  const { t } = useTranslation();
  const handleDeleteInvestment = async () => {
    const res = await deleteInvestment(investmentId);

    if (res.status) {
      onMutate();
      toast.success(t("Investment deleted successfully"));
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="danger"
          className="h-8 w-8 rounded-md bg-background text-danger hover:bg-background"
        >
          <Trash size={20} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Delete Investment")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "Are you sure you want to delete this investment? This action cannot be undone, and all associated data will be permanently removed.",
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={handleDeleteInvestment}
            className="action:bg-destructive/80 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
