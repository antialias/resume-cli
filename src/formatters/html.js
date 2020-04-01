export default async ({ resume, output, theme }) => {
  const html = await theme.render(resume);
  return new Promise((resolve, reject) =>
    output.write(html, (error) => (error ? reject(error) : resolve()))
  );
};
