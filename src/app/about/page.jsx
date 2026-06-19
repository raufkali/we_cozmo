export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>
        We are {process.env.NEXT_PUBLIC_BRAND_NAME || "WeCozmo"}, your trusted
        source for original makeup and skincare products in Pakistan.
      </p>
    </div>
  );
}
