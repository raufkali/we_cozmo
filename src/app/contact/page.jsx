// contact/page.jsx
export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_EMAIL || "seller@wecozmo.com";
  return (
    <div>
      <h1>Contact Us</h1>
      <p>
        Email: <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p>
        Phone:{" "}
        <a href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}>
          {process.env.NEXT_PUBLIC_PHONE}
        </a>
      </p>
    </div>
  );
}
