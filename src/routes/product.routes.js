import { Form, useLoaderData } from "react-router-dom";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  return { contact };
}
