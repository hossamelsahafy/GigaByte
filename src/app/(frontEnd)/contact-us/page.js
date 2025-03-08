"use client";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhone, FaWhatsapp, FaLinkedin, FaYoutube } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import ContactUsForm from "../_component/ContactUs/ContactUsForm";

export default function Contact() {
  const contactItems = [
    {
      icon: <FaLocationDot className="text-[var(--hover-color)]" />,
      text: "Damietta, Egypt",
      link: "https://maps.app.goo.gl/BWX5vb5ZrQXXwQk36",
    },
    {
      icon: <MdEmail className="text-[var(--hover-color)]" />,
      text: "contact@artpackaging.com.sa",
      link: "mailto:contact@artpackaging.com.sa",
    },
    {
      icon: <MdEmail className="text-[var(--hover-color)]" />,
      text: "info@artpackaging.com.sa",
      link: "mailto:info@artpackaging.com.sa",
    },
    {
      icon: <FaPhone className="text-[var(--hover-color)]" />,
      text: "0572339525",
      link: "",
    },
    {
      icon: <FaPhone className="text-[var(--hover-color)]" />,
      text: "+201002750048",
      link: "tel:+201002750048",
    },
    {
      icon: <FaWhatsapp className="text-[var(--hover-color)]" />,
      text: "+201002750048",
      link: "https://api.whatsapp.com/send?phone=2001002750048",
    },
    {
      icon: <FaWhatsapp className="text-[var(--hover-color)]" />,
      text: "201001598579",
      link: "https://api.whatsapp.com/send?phone=201001598579",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-6">
      <div className="flex flex-col items-start text-left gap-4 w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-white mb-4 ml-10">
          Let's <span className="text-[var(--hover-color)]">Connect</span>
        </h1>
        {contactItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg opacity-75 hover:opacity-100 
            transition-opacity duration-300 w-full cursor-pointer border-2 border-transparent hover:border-[var(--hover-color)]"
            onClick={() => {
              if (!item.link.startsWith("mailto:")) {
                window.open(item.link);
              }
            }}
          >
            <div className="text-xl flex-shrink-0">{item.icon}</div>
            {item.link.startsWith("mailto:") ? (
              <a href={item.link} className="text-white hover:underline">
                {item.text}
              </a>
            ) : (
              <p className="text-white">{item.text}</p>
            )}
          </div>
        ))}
      </div>
      <ContactUsForm />
    </div>
  );
}
