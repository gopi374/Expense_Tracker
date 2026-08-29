const getDateRange = (range) => {
  const now = new Date();

  let start;
  let end;

  switch (range) {
    case "daily":
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      break;

    case "weekly":
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );

      end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 7
      );
      break;

    case "monthly":
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );
      break;

    case "yearly":
      start = new Date(
        now.getFullYear(),
        0,
        1
      );

      end = new Date(
        now.getFullYear() + 1,
        0,
        1
      );
      break;

    default:
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );
  }

  return { start, end };
};

export default getDateRange;