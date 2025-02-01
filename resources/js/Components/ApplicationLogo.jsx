export default function ApplicationLogo(props) {
  return (
    <img
      {...props}
      src="/images/water_128px.png" // Path to your image in the public directory
      alt="Application Logo" // Important for accessibility
    />
  );
}
