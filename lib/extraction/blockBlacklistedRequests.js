const getRequestsHandler = ({ blacklistedDomains, blacklistedPaths }) => {
  const regexBlockedPaths = new RegExp(blacklistedPaths.join("|"));
  return (interceptedRequest) => {
    if (blacklistedDomains.includes(new URL(interceptedRequest.url()).host)) {
      interceptedRequest.abort();
    } else if (regexBlockedPaths.test(interceptedRequest.url())) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  };
};

export default async (page, { blacklistedDomains, blacklistedPaths }) => {
  await page.setRequestInterception(true);
  page.on(
    "request",
    getRequestsHandler({ blacklistedDomains, blacklistedPaths })
  );
};
