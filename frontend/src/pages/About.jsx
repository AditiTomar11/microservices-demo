function About() {
  return (
    <div className="page">
      <div className="decorative-bg"></div>

      <div
        className="decorative-ring"
        style={{ top: '120px', right: '8%' }}
      ></div>

      <div
        className="soft-glow"
        style={{ bottom: '100px', left: '5%' }}
      ></div>
      <h2>About ShopEase</h2>
      <p>
        ShopEase ek demo shopping platform hai jo microservices architecture
        (Spring Boot + React) par bana hai. Yeh project Eureka Service
        Discovery, API Gateway, JWT Authentication, aur multiple backend
        services ko demonstrate karta hai.
      </p>
    </div>
  );
}

export default About;
