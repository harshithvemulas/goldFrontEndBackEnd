export function getAvatarFallback(name: string): string {
  if (!name) return "";

  const nameList = name.split(" ");
  let initials = "";

  if (nameList.length > 2) {
    if (nameList[0].length > 3) {
      initials = nameList[0][0] + nameList[nameList.length - 1][0];
    } else {
      initials = nameList[1][0] + nameList[nameList.length - 1][0];
    }
  } else if (nameList.length === 2) {
    initials = nameList[0][0] + nameList[1][0];
  } else {
    initials = nameList[0][0];
  }

  return initials.toUpperCase();
}
