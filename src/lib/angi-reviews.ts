import type { GoogleReview } from "@/lib/google-reviews";
import { live, readCms } from "@/lib/cms/read";

export const angiProfileUrl =
  "https://www.angi.com/companylist/us/ca/sacramento/primefix-home-handyman-services-llc-unlicensed-contractor-reviews-1.htm";

export const angiListing = live(() => readCms().angiListing);

export const angiReviews: GoogleReview[] = [
  {
    id: "nancy-a",
    author: "Nancy A.",
    dateLabel: "Nov 2025",
    rating: 1,
    quote:
      "Extremely unprofessional experience. He showed up alone to mount a 65-inch TV and expected me to help lift and hold it — never disclosed. He left the job unfinished, didn't hook anything up properly and gave no receipt or warranty despite advertising one. He scheduled a follow-up for 11:30 AM the next day, 11/29/25, and never showed up, only giving excuses after I contacted him that his car was in the shop. Then he tried to claim the hookups \"weren't included,\" something he never mentioned until after the fact. Who hooks up a TV without the sound bar operating properly or any hookups? Why buy that service? He advertises hookups. Bait-and-switch. Rescheduled for 4 pm on 11/29/25 and never showed up or called. I do not recommend him. Unreliable, unprepared, and not transparent.",
  },
  {
    id: "renee-j",
    author: "Renee J.",
    dateLabel: "Jun 2025",
    rating: 5,
    quote:
      "Primefix came out to remove 55 inch tv from stand and place new tv. They came out within 2-hours. Once here the new tv was too large to fit safely on the stand. They gave me a new price to mount tv on the wall. The price was very fair. They mounted tv, did an excelllent job. I was hired them again. Highly recommend",
  },
  {
    id: "sabra-b",
    author: "Sabra B.",
    dateLabel: "Jun 2025",
    rating: 5,
    quote:
      "Entire experience was very easy, relaxed and fast. Vlad called me almost immediately after I placed request. Asked all appropriate questions and would have actually accommodated me that day, though following day worked better for me. Ramin w/PrimeFix arrived right on time and mounted my tv right to my specifications. Making certain he got everything exactly right, from placement to size of wire cover used. Even replacing the initial wider wire cover with smaller size, once mentioning I'd wish it weren't so bulky. Without batting an eye and with sincere enthusiasm at quickly being able to accommodate my need and desire!! Truly First Rate Service All Around. Thank You Vlad, Ramin/PrimeFix",
  },
  {
    id: "german-k",
    author: "German K.",
    dateLabel: "Jun 2025",
    rating: 5,
    quote:
      "We weren't sure about mounting on our old plaster walls, but Vlad did it perfectly! He used external covers that look clean and mounted two TVs, plus connected our cable box. He explained the remote syncing and made sure we were 100% set up.",
  },
  {
    id: "abbas-s",
    author: "abbas S.",
    dateLabel: "Jun 2025",
    rating: 5,
    quote:
      "Mounted a 75” TV with a soundbar in our La Jolla home. Didn't want the cables hidden, but Vlad still made it look clean and organized. He connected the Apple TV and even optimized the picture settings. Great experience from start to finish",
  },
  {
    id: "slava-d",
    author: "slava D.",
    dateLabel: "Jun 2025",
    rating: 5,
    quote:
      "Vlad mounted our TV above the fireplace and aligned the soundbar like a pro. Cables hidden, everything connected, including our cable box. He explained how to switch between inputs and made sure the remote worked for all",
  },
  {
    id: "nicolas-p",
    author: "Nicolas P.",
    dateLabel: "Jun 2025",
    rating: 5,
    quote:
      "This is my second time going with this company. They sent Vlad, and he had no issue mounting my 80\"TV with a swivel mount. My moving company lost some screws that were needed for the installation, and luckily Vlad had matching spares on hand and spared them with no additional charge. 10/10, go with these guys and support a small local business",
  },
  {
    id: "egor-h",
    author: "Egor H.",
    dateLabel: "Jun 2025",
    rating: 5,
    quote:
      "Vlad at PrimeFix mounted our 65\" TV on drywall in our downtown condo and made it look amazing! He used a sleek cable concealer that blends perfectly with the wall. He also set up our Apple TV and took the time to explain how everything works. Super professional and friendly. Highly recommend!",
  },
  {
    id: "antonio-l",
    author: "Antonio L.",
    dateLabel: "May 2025",
    rating: 5,
    quote:
      "The gentleman who came to Install my TV mount showed up on time and was extremely professional. He came prepared to install my 85” tv with tools in hand. He updated me on everything he was doing and when I didn’t have the exact screws he needed he offered to use the extra ones he had. I asked if he could hang my Sound bar and hide the cords so they weren’t visible from my seating area. He right away did an assessment and was able to easily install both. Not only did he install my TV and soundbar he was nice enough to turn them on and make sure they sync everything together and made sure I understood how it worked. Above and beyond VIP service. I would definitely use this service again and have referred them to my friends and family.",
  },
  {
    id: "edgar-m",
    author: "Edgar M.",
    dateLabel: "May 2025",
    rating: 5,
    quote:
      "I'm so glad I found this company, they made it an amazing job, Vlad is a big professional, who mounted 5 TVs in my house, even above the fireplace with the tile, the job was so quick with confirming all the details. Huge thanks to u, and we definitely will hire u for future projects!",
  },
  {
    id: "danny-c",
    author: "Danny C.",
    dateLabel: "May 2025",
    rating: 5,
    quote:
      "Vlad was very professional and patient with everything that he did. He has done 2 tv mounts and some other handyman jobs for me. I also referred him to my brother in law and he did 4 tv mounts for him. Great job Vlad!!!",
  },
  {
    id: "moises-r",
    author: "Moises R.",
    dateLabel: "May 2025",
    rating: 5,
    quote:
      "Very impressed with Vlad’s professionalism and craftsmanship. My set up looks great, thanks to Vlad!! Will definitely recommend and use again.",
  },
];
