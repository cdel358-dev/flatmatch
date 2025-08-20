//-----v1-----
// // src/components/FlatmateAvatar.tsx
// import React, { useState } from "react";

// export default function FlatmateAvatar({
//   name,
//   avatar,
//   size = 40, // px
// }: {
//   name: string;
//   avatar?: string;
//   size?: number;
// }) {
//   const [imgError, setImgError] = useState(false);

//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   if (avatar && !imgError) {
//     return (
//       <img
//         src={avatar}
//         alt={name}
//         onError={() => setImgError(true)}
//         className="rounded-full object-cover"
//         style={{ width: size, height: size }}
//       />
//     );
//   }

//   // 🎨 fallback: circle with initials
//   const colors = [
//     "bg-pink-500",
//     "bg-indigo-500",
//     "bg-emerald-500",
//     "bg-amber-500",
//     "bg-blue-500",
//     "bg-purple-500",
//   ];
//   const color = colors[name.charCodeAt(0) % colors.length];

//   return (
//     <div
//       className={`flex items-center justify-center rounded-full text-white font-semibold ${color}`}
//       style={{ width: size, height: size, fontSize: size * 0.4 }}
//     >
//       {initials}
//     </div>
//   );
// }

// v2
// src/components/FlatmateAvatar.tsx
// import React, { useState } from "react";

// export default function FlatmateAvatar({ name, avatar, size = 40 }: { name: string; avatar?: string; size?: number; }) {
//   const [src, setSrc] = useState(avatar);
//   const [failed, setFailed] = useState(false);

//   const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

//   if (src && !failed) {
//     return (
//       <img
//         src={src}
//         alt={name}
//         // onError={() => {
//         //   // try swapping .png -> .jpg once
//         //   if (src.endsWith(".png")) setSrc(src.replace(/\.png$/i, ".jpg"));
//         //   else setFailed(true);
//         // }}
//         className="rounded-full object-cover"
//         style={{ width: size, height: size }}
//       />
//     );
//   }

//   const colors = ["bg-pink-500","bg-indigo-500","bg-emerald-500","bg-amber-500","bg-blue-500","bg-purple-500"];
//   const color = colors[name.charCodeAt(0) % colors.length];

//   return (
//     <div className={`flex items-center justify-center rounded-full text-white font-semibold ${color}`}
//          style={{ width: size, height: size, fontSize: size * 0.4 }}
//          aria-label={name} title={name}>
//       {initials}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";

export default function FlatmateAvatar({
  name,
  avatar,
  size = 40,
}: { name: string; avatar?: string; size?: number }) {
  const [src, setSrc] = useState<string | undefined>(avatar);
  const [failed, setFailed] = useState(false);

  useEffect(() => setSrc(avatar), [avatar]);

  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => {
          // try .png -> .jpg once, then fall back to initials
        //   if (src.endsWith(".png")) setSrc(src.replace(/\.png$/i, ".jpg"));
        //   else setFailed(true);
        }}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const colors = ["bg-pink-500","bg-indigo-500","bg-emerald-500","bg-amber-500","bg-blue-500","bg-purple-500"];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-semibold ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
