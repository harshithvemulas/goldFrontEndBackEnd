export function AuthPageHeading({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  return (
    <>
      <p className="mb-2.5 text-sm text-secondary-text">{subTitle}</p>
      <h1 className="text-[28px] font-medium leading-10 md:text-[32px]">
        {title}
      </h1>
    </>
  );
}
