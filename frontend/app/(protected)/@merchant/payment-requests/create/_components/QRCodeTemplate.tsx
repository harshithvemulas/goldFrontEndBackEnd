import Separator from "@/components/ui/separator";
import { useBranding } from "@/hooks/useBranding";
import { imageURL } from "@/lib/utils";
import Image from "next/image";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(() => ({
  root: {
    backgroundColor: "#fff",
    borderRadius: 30,
    border: "5px solid #EFEFF7",
    padding: 12,
  },
  header: {
    marginBottom: 10,
  },
  description: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    display: "flex",
    justifyContent: "center",
  },
  merchantLogo: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
    padding: 10,
    fontSize: 18,
    color: "#000",
  },
  qrContainer: {
    position: "relative",
    backgroundColor: "#01a79e",
    borderRadius: 20,
    width: 250,
    height: 250,
    margin: 8,
    padding: 10,
  },
  qrInner: {
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  name: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "18px",
    lineHeight: "29px",
    textAlign: "center",
  },
  email: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#000",
    textAlign: "center",
  },
}));

interface Props {
  id: string;
  name?: string;
  email?: string;
}

// eslint-disable-next-line react/function-component-definition
const QRCodeTemplate: FC<PropsWithChildren<Props>> = ({
  children,
  name,
  id,
  email,
}) => {
  const classes = useStyles();
  const { logo, siteName } = useBranding();
  const { t } = useTranslation();
  return (
    <div className={classes.root} id={id}>
      <div className={classes.header}>
        <div className={classes.logo}>
          <Image
            src={imageURL(logo)}
            width={160}
            height={40}
            alt={siteName}
            className="max-h-10 object-contain"
          />
        </div>
        <p className={classes.description}>
          {t("To make payment, scan the QR Code.")}
        </p>
      </div>
      <Separator className="my-2" />
      <div className={classes.qrContainer}>
        <div className={classes.qrInner}>{children}</div>
      </div>
      {name && (
        <div className="mb-1">
          <div className={classes.name}>{name}</div>
          <div className={classes.email}>{email}</div>
        </div>
      )}
    </div>
  );
};

export default QRCodeTemplate;
