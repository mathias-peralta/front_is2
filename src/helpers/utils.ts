export const stringAvatar = (name: string, fontSize?: number) => {
  if (name.split(" ").length > 1) {
    return {
      sx: {
        bgcolor: "red",
        fontSize: fontSize ? fontSize : undefined,
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  return {
    sx: {
      bgcolor: "red",
      fontSize: fontSize ? fontSize : undefined,
    },
    children: `${name.split(" ")[0][0]}`,
  };
};
