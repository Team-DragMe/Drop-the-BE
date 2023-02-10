export const slackMessage = (
  method: string,
  originalUrl: string,
  error: any,
  uid?: number,
): string => {
  console.log(error);
  return `🙅🆘🙅 [ERROR] [${method}]${originalUrl} [USER] ${
    uid ? `uid: ${uid}` : 'req.user 없음'
  } // [STACK] ${error}`;
};
