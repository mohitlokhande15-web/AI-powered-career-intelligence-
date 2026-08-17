export function buildJobSearchLinks(title: string, company: string, location: string) {
  const q = encodeURIComponent(`${title} ${company}`);
  const qLoc = encodeURIComponent(`${title} ${location}`);

  return [
    {
      label: "LinkedIn",
      url: `https://www.linkedin.com/jobs/search/?keywords=${q}`,
    },
    {
      label: "Naukri",
      url: `https://www.naukri.com/${encodeURIComponent(title)}-jobs-in-${encodeURIComponent(location)}`,
    },
    {
      label: "Indeed",
      url: `https://in.indeed.com/jobs?q=${qLoc}`,
    },
    {
      label: "Google Jobs",
      url: `https://www.google.com/search?q=${q}+job`,
    },
  ];
}