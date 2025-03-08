import React from "react";
import Banner from "./_component/home/Banner";
import Collections from "./_component/home/Collections";
import Top from "./_component/home/Top";
import ContactSection from "./_component/home/contactus";
const page = () => {
  return (
    <div>
      <Banner />
      <Top />
      <Collections />
      <ContactSection />
    </div>
  );
};

export default page;
