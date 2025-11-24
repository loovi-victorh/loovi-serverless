export async function checkExecutive(userId: string) {
  const spaceId = process.env.SEGMENT_PROFILES_SPACE_ID;
  const apiKey = process.env.SEGMENT_PROFILES_API_KEY;

  const endpoint =
    "https://profiles.segment.com/v1/spaces/" +
    spaceId +
    "/collections/users/profiles/user_id:" +
    userId +
    "/traits" +
    "?class=computed_trait&limit=50";

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Basic ${btoa(apiKey + ":")}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    // Retry on 5xx (server errors) and 429s (rate limits)
    console.log("Segment APIFailed with", response.status);
    return false;
  }

  const res = await response.json();

  const traits = res.traits;
  if (traits?.had_executive_quotation) {
    const hadExecutiveQuotation = traits.had_executive_quotation;
    return hadExecutiveQuotation ? true : false;
  }

  return false;
}
