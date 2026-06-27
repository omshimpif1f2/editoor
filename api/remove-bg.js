export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks);

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.REMOVE_BG_API_KEY,
      "Content-Type": req.headers["content-type"]
    },
    body
  });

  const result = await response.arrayBuffer();

  res.setHeader("Content-Type", "image/png");
  res.status(response.status).send(Buffer.from(result));
}
