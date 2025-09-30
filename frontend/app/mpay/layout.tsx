import React from "react";

export default function MpayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full overflow-y-scroll">
      <div className="mx-auto w-full max-w-[560px] py-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
