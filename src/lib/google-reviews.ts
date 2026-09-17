export const googleListing = {
  name: "Primefix Home & Handyman Services",
  rating: 4.8,
  reviewCount: 96,
  mapsUrl: "https://maps.app.goo.gl/cZ8BVENdcqzqpoXh8",
  writeReviewUrl: "https://maps.app.goo.gl/cZ8BVENdcqzqpoXh8",
} as const;

export type GoogleReview = {
  id: string;
  author: string;
  dateLabel: string;
  rating: 5;
  quote: string;
};

export const googleReviews: GoogleReview[] = [
  {
    id: "paula-izidoro",
    author: "Paula Izidoro",
    dateLabel: "Aug 2026",
    rating: 5,
    quote:
      "I highly recommend Primefix Home! I initially found them on Instagram and was a bit leery at first, but I am absolutely thrilled with the service provided. Vlad did a super professional job mounting both my TV and soundbar and hiding the wires. He came fully prepared and even provided the necessary mounts. I was actually missing the safety screws needed to secure my TV, but he had them on hand and didn't charge me anything extra to use them. On top of the excellent workmanship, Vlad was very responsive and accommodating on scheduling, and the pricing was incredibly reasonable compared to other quotes I looked into. I am so happy with the final result.",
  },
  {
    id: "taya-harley",
    author: "Taya Harley",
    dateLabel: "Aug 2026",
    rating: 5,
    quote:
      "I had a great experience! Vlad was great! The TV installation was done quickly and professionally, and everything was mounted perfectly with all the wires neatly hidden. Vlad made sure everything was level, working properly, and even helped set everything up before leaving. I've also used Vlad for handyman work, and the quality has always been excellent. He is reliable, knowledgeable, punctual, and pay attention to the details. Definitely recommend Vlad!!!",
  },
  {
    id: "josue-perez",
    author: "Josue david Perez rocha",
    dateLabel: "Aug 2026",
    rating: 5,
    quote:
      "I recently hired this handyman to mount my TV on the wall, and he did an outstanding job! The installation looks clean and professional, and I'm now really happy and content with how everything turned out. The price was very good, and his punctuality and overall professionalism were top notch. He showed up on time, worked efficiently, and left the space neat. Highly recommend him I'll definitely be calling again for future projects! Thank you Vlad!",
  },
  {
    id: "charles-money",
    author: "charles money",
    dateLabel: "Aug 2026",
    rating: 5,
    quote:
      "Unbelievable guest service!!! I've dealt with a lot of insulation people in the past since I like to have 3D art on the walls and most of them have been extremely difficult with working with what my vision is. However they had no problem at all prime fix is literally one of my favorite handyman now!! I won't go to anybody else in the future they knew exactly what I wanted dealt with my crazy personality and my vision for my layout and had no problem working around my art!!! Truly an amazing experience.",
  },
  {
    id: "silvia-duran",
    author: "silvia duran",
    dateLabel: "Feb 2026",
    rating: 5,
    quote:
      "Vlad was amazing—very respectful and super helpful. He mounted my 85-inch TV, hid the wires perfectly, and put together my 80-inch TV stand with a fireplace. Everything looks beautiful, and I couldn't be happier. Highly recommend!",
  },
  {
    id: "regina-lynn",
    author: "Regina Lynn",
    dateLabel: "Oct 2025",
    rating: 5,
    quote:
      "Vlad installed and mounted my 50” Samsung The Frame TV in my guest bedroom. A few months ago he mounted my 55” The Frame TV above my fireplace, in my living room. He is prompt, professional and very kind. I loved that I didn’t have to wait several days to receive service. I look forward to working with him on my other home projects in the future.",
  },
  {
    id: "maksym-husiev",
    author: "Maksym Husiev",
    dateLabel: "Nov 2025",
    rating: 5,
    quote:
      "I am beyond happy with the installation of my new projector and screen. I wanted to leave a glowing review for the technician who did the work. I was honestly amazed that he handled the entire installation-a large screen and the projector setup-all by himself. His professionalism, skill, and attention to detail were incredible to watch. He was efficient, careful, and made sure everything was perfect. The final result is flawless. The screen is perfectly aligned, the setup is clean, and my new home theater looks absolutely amazing.",
  },
  {
    id: "brian-vandemark",
    author: "Brian VanDeMark",
    dateLabel: "Feb 2026",
    rating: 5,
    quote:
      "Through hard work and craftsmanship, Vlad miraculously transformed a worn-out storage area in my basement into a splendid and sparkling home library for my book collection—performing professionally, responsively, and courteously throughout. Bravo Vlad!",
  },
];
