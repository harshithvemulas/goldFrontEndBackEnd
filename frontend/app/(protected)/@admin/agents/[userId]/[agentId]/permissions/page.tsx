"use client";

/* eslint-disable no-nested-ternary */
import { SearchBox } from "@/components/common/form/SearchBox";
import { Loader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Switch from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type Permission as TPermission,
  togglePermission,
} from "@/data/admin/togglePermission";
import { useSWR } from "@/hooks/useSWR";
import { Gateway } from "@/types/gateway";
import { Method } from "@/types/method";
import { User } from "iconsax-react";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function Permission() {
  const { t } = useTranslation();
  const params = useParams();
  const [methodSearch, setMethodSearch] = React.useState("");
  const [gatewaySearch, setGatewaySearch] = React.useState("");

  const { data, isLoading } = useSWR(
    `/admin/users/permission/${params.userId}`,
  );

  // get user block methods list
  const { data: blockMethods, isLoading: isBlockMethodLoading } = useSWR(
    `/admin/users/blacklisted-methods/${params.userId}&search=${methodSearch}`,
  );

  // get user block methods list
  const { data: blockGateway, isLoading: isBlockGatewayLoading } = useSWR(
    `/admin/users/blacklisted-gateways/${params.userId}&search=${gatewaySearch}`,
  );

  const handlePermission = (
    formData: { permission: TPermission; status: boolean },
    customerId: number | string,
  ) => {
    toast.promise(togglePermission(formData, customerId), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-xl border border-border bg-background">
        <div className="border-none px-4 py-0">
          <div className="py-4 hover:no-underline">
            <div className="flex items-center gap-1">
              <p className="text-base font-medium leading-[22px]">
                {t("Permitted Actions")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6 border-t border-divider px-1 py-4">
            <div className="max-w-[900px]">
              <Table>
                <TableHeader className="[&_tr]:border-b-0">
                  <TableRow>
                    <TableHead>{t("Actions")}</TableHead>
                    <TableHead>{t("Permission")}</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableRow key={index}>
                        <TableCell className="w-full">
                          <Skeleton className="h-4 w-2/3" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
                      <PermissionTableRow
                        title={t("Deposit money")}
                        type="deposit"
                        defaultStatus={Boolean(data?.data?.permission?.deposit)}
                        onChange={(args) =>
                          handlePermission(args, data?.data?.permission?.id)
                        }
                      />

                      <PermissionTableRow
                        title={t("Withdraw money")}
                        type="withdraw"
                        defaultStatus={Boolean(
                          data?.data?.permission?.withdraw,
                        )}
                        onChange={(args) =>
                          handlePermission(args, data?.data?.permission?.id)
                        }
                      />

                      <PermissionTableRow
                        title={t("Payment")}
                        type="payment"
                        defaultStatus={Boolean(data?.data?.permission?.payment)}
                        onChange={(args) =>
                          handlePermission(args, data?.data?.permission?.id)
                        }
                      />

                      <PermissionTableRow
                        title={t("Exchange")}
                        type="exchange"
                        defaultStatus={Boolean(
                          data?.data?.permission?.exchange,
                        )}
                        onChange={(args) =>
                          handlePermission(args, data?.data?.permission?.id)
                        }
                      />

                      <PermissionTableRow
                        title={t("Transfer")}
                        type="transfer"
                        defaultStatus={Boolean(
                          data?.data?.permission?.transfer,
                        )}
                        onChange={(args) =>
                          handlePermission(args, data?.data?.permission?.id)
                        }
                      />

                      <PermissionTableRow
                        title={t("Add account")}
                        type="addAccount"
                        defaultStatus={Boolean(
                          data?.data?.permission?.addAccount,
                        )}
                        onChange={(args) =>
                          handlePermission(args, data?.data?.permission?.id)
                        }
                      />

                      <PermissionTableRow
                        title={t("Add/Remove balance")}
                        type="addRemoveBalance"
                        defaultStatus={Boolean(
                          data?.data?.permission?.addRemoveBalance,
                        )}
                        onChange={(args) =>
                          handlePermission(args, data?.data?.permission?.id)
                        }
                      />

                      <PermissionTableRow
                        title={t("User services")}
                        type="services"
                        defaultStatus={Boolean(
                          data?.data?.permission?.services,
                        )}
                        onChange={(args) =>
                          handlePermission(args, data?.data?.permission?.id)
                        }
                      />
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <div className="border-none px-4 py-0">
          <div className="py-4 hover:no-underline">
            <div className="flex w-full flex-wrap items-center justify-between gap-1 gap-y-2 sm:gap-y-0">
              <p className="text-base font-medium leading-[22px]">
                {t("Blacklisted Gateways")}
              </p>

              <SearchBox
                value={methodSearch}
                onChange={(e) => setMethodSearch(e.target.value)}
                placeholder={t("Search")}
                iconPlacement="end"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 border-t border-divider px-1 py-4">
            <Table>
              <TableHeader className="[&_tr]:border-b-0">
                <TableRow>
                  <TableHead>{t("Logo")}</TableHead>
                  <TableHead>{t("Name")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("Recommended")}</TableHead>
                  <TableHead>{t("Permission")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isBlockMethodLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : blockMethods?.data?.blackListedMethods?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-accent/50">
                      {t("No Data")}
                    </TableCell>
                  </TableRow>
                ) : (
                  blockMethods?.data?.blackListedMethods
                    .map((d: any) => new Method(d))
                    ?.map((method: Method) => (
                      <TableRow key={method.id} className="odd:bg-accent">
                        <TableCell>
                          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            <User size={20} />
                          </div>
                        </TableCell>
                        <TableCell className="w-[420px]">
                          {method.name}
                        </TableCell>
                        <TableCell>
                          {method.active ? (
                            <Badge variant="success">{t("Active")}</Badge>
                          ) : (
                            <Badge variant="secondary">{t("Inactive")}</Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {method.recommended ? (
                            <Badge variant="important">{t("Yes")}</Badge>
                          ) : (
                            <Badge variant="secondary">{t("No")}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <span>{t("No")}</span>
                            <Switch
                              defaultChecked={false}
                              disabled
                              className="border border-secondary-text data-[state=checked]:border-transparent [&>span]:bg-secondary-text [&>span]:data-[state=checked]:bg-background"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <div className="border-none px-4 py-0">
          <div className="py-4 hover:no-underline">
            <div className="flex w-full flex-wrap items-center justify-between gap-1 gap-y-2 sm:gap-y-0">
              <p className="text-base font-medium leading-[22px]">
                {t("Blacklisted Methods")}
              </p>

              <SearchBox
                value={gatewaySearch}
                onChange={(e) => setGatewaySearch(e.target.value)}
                placeholder={t("Search")}
                iconPlacement="end"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 border-t border-divider px-1 py-4">
            <Table>
              <TableHeader className="[&_tr]:border-b-0">
                <TableRow>
                  <TableHead className="w-2/5">{t("Name")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("Recommended")}</TableHead>
                  <TableHead>{t("Permission")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isBlockGatewayLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : blockGateway?.data?.blackListedGateways?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-accent/50">
                      {t("No Data")}
                    </TableCell>
                  </TableRow>
                ) : (
                  blockGateway?.data?.blackListedGateways
                    ?.map((d: any) => new Gateway(d))
                    ?.map((gateway: Gateway) => (
                      <TableRow key={gateway?.id} className="odd:bg-accent">
                        <TableCell className="w-2/5">{gateway?.name}</TableCell>
                        <TableCell>
                          {gateway.active ? (
                            <Badge variant="success">{t("Active")}</Badge>
                          ) : (
                            <Badge variant="secondary"> {t("Inactive")} </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {gateway.recommended ? (
                            <Badge variant="important">{t("Yes")}</Badge>
                          ) : (
                            <Badge variant="secondary"> {t("No")} </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <span>{t("No")}</span>
                            <Switch
                              defaultChecked={false}
                              disabled
                              className="border border-secondary-text data-[state=checked]:border-transparent [&>span]:bg-secondary-text [&>span]:data-[state=checked]:bg-background"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Permission table row
function PermissionTableRow({
  title,
  type,
  defaultStatus,
  onChange,
}: {
  title: string;
  type: TPermission;
  defaultStatus: boolean;
  onChange: ({
    permission,
    status,
  }: {
    permission: TPermission;
    status: boolean;
  }) => void;
}) {
  const { t } = useTranslation();

  return (
    <TableRow className="odd:bg-accent">
      <TableCell>{title}</TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <span>{defaultStatus ? t("Yes") : t("No")}</span>
          <Switch
            defaultChecked={defaultStatus}
            onCheckedChange={(checked) =>
              onChange({ permission: type, status: checked })
            }
            className="border border-secondary-text data-[state=checked]:border-transparent [&>span]:bg-secondary-text [&>span]:data-[state=checked]:bg-background"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
