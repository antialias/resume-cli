import request from "superagent";

export default ({ server, name }) => {
  const url = server + name;
  return {
    async render(resume) {
      const { text, status } = await request
        .post(url)
        .send({ resume })
        .set("Accept", "application/json");
      if (status !== 200) {
        throw new Error(
          `error ${status} when attempting to render resume using remote theme at ${url}: ${text}`
        );
      }
      return text;
    },
  };
};
