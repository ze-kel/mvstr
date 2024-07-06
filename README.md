### mvstr
![IMG_9385](https://github.com/ze-kel/mvstr/assets/63189390/2423139e-e756-45e2-add7-46ce768b3957)

My friends taking the UX & Product Design course at uni asked me to create a working prototype of their app. I wanted to get experience with React Native so this got made. Code quality is mediocre, but the goal was to create something that works and demos fine. 

The requirements were:
  - a mobile app for organizing parties\events
      - authorization via sms + VK oauth
      - basic crud in the app
      - wishlist for gifts(crud + image uploading)
      - guest list with phone contacts integration
      - website with "you're invited page" where people can check whether they will come and reserve one of the gifts from wishlist

Figma files were provided.

### Tech 
I started with [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) template — so nextjs as an api server + web and react native for app, drizzle as orm, trpc for api setup, tanstack query for data management. Overall working with it was pleasant and I definitely recommend it.

When I stated t3-turbo did not provide configuration for app auth. I had to implement it myself. I replaced AuthJS(aka NextAuth) with [Lucia](https://lucia-auth.com/) because I find it more straightforward and pleasant to work with.

The only thing I disliked was [NativeWind](https://www.nativewind.dev/). It's problems were
  - Difference in web and RN css implementation — it's sometimes unclear whether web solution will map to RN solution or just not work
  - No RN-specific vscode integration — you have no idea whether you can use a certain class in RN
  - Unreliable hot reloading. Sometimes you add a class and it's not working for some random reason. Sometimes it works after app reload, sometimes not.

IMO all of this makes TW not worth it for RN and I would rather use a regular style prop next time.

Additionally I needed s3 bucket for images. I used subabase storage since I already had my db there, worked well as usual with supabase.

I also had some typescript issues with typescript eslint not inferring types in internal packages. I ended up ignoring it because typescript intellisense inferred everything fine and just added eslint-ignore to a bunch of files. Unsure why that happened, but when doing the same setup in my other project more recently I had no issues with it. Likely a version mismatch thing.
