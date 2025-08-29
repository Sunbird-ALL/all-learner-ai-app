export const getAssetUrl = (filename, type = "mechanics_images") => {
  if (!filename) return false;
  return `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/${type}/${filename}`;
};

export const getAssetAudioUrl = (filename, type = "mechanics_audios") => {
  if (!filename) return false;
  return `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/${type}/${filename}`;
};

export const applePhonemeAudio = "c44ffd22-c205-4745-8aca-5f45efabbf4c.mp3";
export const catPhonemeAudio = "1cca4dac-684b-48d2-9dfa-93a4c509dfdd.mp3";
export const peaPhonemeAudio = "137c172a-a9f8-422b-aa7c-1d9126c0dcb1.mp3";
export const ballPhonemeAudio = "0256c499-94a8-4b8a-b34f-e809a0f270a5.mp3";
export const zebraPhonemeAudio = "eab4b8d7-a71c-4149-954b-10cfcc01f887.mp3";
export const cubPhonemeAudio = "a4e8aef3-7819-4a54-bdcc-1939c0ee4530.mp3";
export const icePhonemeAudio = "847f321f-f216-4ef2-96cf-073c6a28d133.mp3";
export const garlicPhonemeAudio = "a741e634-135a-4a09-b10d-8bfea480d228.mp3";
export const dogPhonemeAudio = "6f59dbab-f8b9-4a67-9ffa-2da756e94848.mp3";
export const windowPhonemeAudio = "39d2112c-a9aa-4162-80ce-099f42c56aec.mp3";
export const swordPhonemeAudio = "f04603c4-9d29-4af3-9501-a2293497f25c.mp3";
export const eggPhonemeAudio = "3492971b-35af-46b9-9762-1336da467f84.mp3";
export const penPhonemeAudio = "004aaf85-3641-4a0d-b40e-47de73a17a87.mp3";
export const kitePhonemeAudio = "a951e524-2902-4314-bf10-8643adbc7e0c.mp3";
export const fishPhonemeAudio = "82ceae1e-6c93-4e19-a7e6-a1ca7b6833a2.mp3";
export const giraffePhonemeAudio = "4ab0a9bd-2b8f-4394-b699-15bcce561022.mp3";
export const leafPhonemeAudio = "b182e9e7-154a-4a69-aae1-ccaa537e4a42.mp3";
export const goatPhonemeAudio = "1de204da-3560-4231-8724-844ae084a098.mp3";
export const tigerPhonemeAudio = "a2959a62-d104-481f-9ec1-24085ce48493.mp3";
export const handPhonemeAudio = "b6c90012-3733-4b31-ab84-103732bcf4e8.mp3";
export const teacherPhonemeAudio = "0f51a845-b83e-4ee6-a98a-1e5e636b599c.mp3";
export const earthPhonemeAudio = "94269edd-1ebc-4eda-ac2d-53dfae882077.mp3";
export const pigPhonemeAudio = "5d0a806b-ea53-40eb-8b5a-612aeae3eadd.mp3";
export const dhobiPhonemeAudio = "c1bf5585-cce1-452d-b779-5395b4d559a2.mp3";
export const jamPhonemeAudio = "5c22226b-bd00-421a-b6b2-5e2da30c1550.mp3";
export const brinjalPhonemeAudio = "5f7d78c2-4922-4525-8072-11dad00ed8d9.mp3";
export const rajPhonemeAudio = "28365392-a4cd-4a5c-83c5-cf0219cb8117.mp3";
export const monkeyPhonemeAudio = "8fe2f0f9-6254-4a59-9528-9c07dcbdadb2.mp3";
export const bookPhonemeAudio = "cc92f22c-aad6-4016-a256-a27e99f20800.mp3";
export const lionPhonemeAudio = "0823900f-87fe-4fdb-8af9-d12584595b89.mp3";
export const balloonPhonemeAudio = "87363175-7674-47b7-8216-570be800fb41.mp3";
export const bellPhonemeAudio = "2e7212e4-5275-4d36-837a-768fe060111e.mp3";
export const mangoPhonemeAudio = "21238b39-9e68-450d-8daa-8c0c09d8fc8a.mp3";
export const lemonPhonemeAudio = "21a540c1-a628-497f-a6f0-eecb787d53da.mp3";
export const nestPhonemeAudio = "b31853ee-b1c7-4535-b619-b1930482a974.mp3";
export const honeyPhonemeAudio = "7d4eee6d-9fe4-4a34-8a74-b30de34de97f.mp3";
export const orangePhonemeAudio = "facf1b22-9192-4d93-9741-b41c8e76db35.mp3";
export const capPhonemeAudio = "e94ff881-cd0b-40a0-8f65-b31d79677879.mp3";
export const queenPhonemeAudio = "202957b2-5fc6-4301-b1b6-3c44ef7c45f7.mp3";
export const mosquitoPhonemeAudio = "cc301073-cbf4-4070-96c0-b1c92ae30167.mp3";
export const ratPhonemeAudio = "8f122fe9-5a2f-4c73-8f0a-c4bfc661092d.mp3";
export const carrotPhonemeAudio = "0a9aa842-7a57-4c28-8de1-6dd4a7550987.mp3";
export const carPhonemeAudio = "9b8eb9ff-805d-4fd7-8d59-e329f2fd8cff.mp3";
export const sunPhonemeAudio = "acddb132-e3f8-42ba-9d66-eb7e9d1e9df8.mp3";
export const horsePhonemeAudio = "78dd9087-8f05-434d-8824-23449836c575.mp3";
export const busPhonemeAudio = "273458af-7a32-427b-a225-bf1b8422558a.mp3";
export const watchPhonemeAudio = "56e5635f-bdad-47cc-9095-8a9e2b48fc39.mp3";
export const plantPhonemeAudio = "31374a49-1ef2-462a-99a1-48e549740a90.mp3";
export const umbrellaPhonemeAudio = "e03d5bf6-e02e-432f-b756-af61c6cde565.mp3";
export const dustbinPhonemeAudio = "92272976-3d31-4428-b3a2-bfbe28c1265e.mp3";
export const ladduPhonemeAudio = "967d0599-7292-47a6-8300-94205b0940a6.mp3";
export const vanPhonemeAudio = "75056fba-d6a1-41d4-82b3-10385af1dadc.mp3";
export const guavaPhonemeAudio = "4493b265-dc94-4a23-a082-3d58a2e97941.mp3";
export const crowPhonemeAudio = "4f4ea9cb-72e7-47d5-8cc4-27efedd53d68.mp3";
export const xrayPhonemeAudio = "fe3aac79-9b91-4ec4-a4fe-91db7d2f060d.mp3";
export const textbookPhonemeAudio = "2f45dc7c-b8b3-4f5f-a23d-8a5e39acb66a.mp3";
export const foxPhonemeAudio = "a8bffefd-7268-4325-876b-66f0cda2a3b3.mp3";
export const yakPhonemeAudio = "e7357a4d-e2f2-440a-8d4f-bc29cad93a78.mp3";
export const papayaPhonemeAudio = "467472ba-8012-43de-a98e-e15242465c9c.mp3";
export const keyPhonemeAudio = "934e245a-b84a-43ce-a8c4-b77bd6f58e0c.mp3";
export const puzzlePhonemeAudio = "b3f3d4b7-3523-476e-85e0-11bc19160a3a.mp3";
export const quizPhonemeAudio = "fe5e5c29-0cae-4522-83b2-34869fe6d9d6.mp3";

export const APhonemeAudio = "36e1b035-9f56-449f-8c34-1adf7c8de2e3.mp3";
export const BPhonemeAudio = "2cb12b8b-fe90-4c00-bbae-19201b0e5fef.mp3";
export const CPhonemeAudio = "41e58bfb-79de-4d11-b93b-770fb41fcd0e.mp3";
export const DPhonemeAudio = "9292355b-d9a5-4580-b273-36692a786fda.mp3";
export const EPhonemeAudio = "a952532f-b89c-4d6c-9bbb-899fce98b154.mp3";
export const FPhonemeAudio = "ea0898d9-a0a0-4ea5-a650-68dcaf001529.mp3";
export const GPhonemeAudio = "5b4d00cc-eb73-49f2-8232-14f57c664f45.mp3";
export const HPhonemeAudio = "0aeeea80-008f-4a6f-8b1a-f40c92a3a492.mp3";
export const IPhonemeAudio = "8637cfff-4632-4c64-a83e-e1bfcddd4cf8.mp3";
export const JPhonemeAudio = "6d9dbd0f-eb78-4723-a5eb-fc39dbe51df9.mp3";
export const KPhonemeAudio = "a5e9e05f-3023-4574-be8f-18f7f43f64be.mp3";
export const LPhonemeAudio = "08a09a97-ee77-4989-8dc5-e9558e86d2a9.mp3";
export const MPhonemeAudio = "4abab969-88de-4fff-8a0f-a0eedc5c5e3c.mp3";
export const NPhonemeAudio = "c68fdd7e-0f2c-42a2-837e-5835d975dd15.mp3";
export const OPhonemeAudio = "8c497f32-9b10-42c3-929f-876d24d11f8c.mp3";
export const PPhonemeAudio = "6273715b-d5b6-4914-a14b-57e59a3fabe4.mp3";
export const QPhonemeAudio = "6a74dfba-2e15-4f80-8ac0-f180f38db313.mp3";
export const RPhonemeAudio = "98b88457-eb3c-4c2d-89f0-f652b4847ecc.mp3";
export const SPhonemeAudio = "094fa70a-7ae3-4c8e-8979-67d5b45b6c31.mp3";
export const TPhonemeAudio = "9a9f2b36-b97b-42ef-860f-1c42b7c5e4f7.mp3";
export const UPhonemeAudio = "06ec93a2-fd9b-4e51-9873-340e2394c2d2.mp3";
export const VPhonemeAudio = "72abfcd8-c4a4-4d8f-9488-ac8f663a0f13.mp3";
export const WPhonemeAudio = "9f4d7328-a092-4370-82ac-b7533cbf1299.mp3";
export const XPhonemeAudio = "62a3dd27-4af2-46e8-bc76-0be49c316d37.mp3";
export const YPhonemeAudio = "c97b065d-c31e-4ab8-b561-d13d4836de73.mp3";
export const ZPhonemeAudio = "44ca5adb-a9ba-43b5-9611-a9c00369f454.mp3";

export const moonPhonemeAudioYT = "5d7131de-a05a-4dc5-9249-4fa181a963ae.mp3";
export const boatPhonemeAudioYT = "697f57ec-f455-438d-901d-39c3f977e96d.mp3";
export const starPhonemeAudioYT = "d8fb4014-9116-4d08-a420-939a60293897.mp3";
export const chainPhonemeAudioYT = "6fdb65a3-1c5d-4061-a55c-48c63458e4e8.mp3";
export const zipPhonemeAudioYT = "5fbb5d4c-5973-4c81-bbf0-1b041d23e031.mp3";
export const motherPhonemeAudioYT = "baaabf69-6201-4341-8dc1-6c54bf58b086.mp3";
export const bluePhonemeAudioYT = "dd071245-eb86-46db-99df-daa3a66ae0ec.mp3";
export const ballPhonemeAudioYT = "5ea8ae82-7d77-4876-9fe7-c5ffb625757f.mp3";
export const rainPhonemeAudioYT = "2bd5c50c-5727-4239-abb4-6cf3dcf202e3.mp3";
export const quiltPhonemeAudioYT = "af4424d8-fe3c-4d1c-8438-abcba0620e02.mp3";
export const sisterPhonemeAudioYT = "6964ab5d-cbc7-45d3-a23e-60344f8dfa02.mp3";
export const yakPhonemeAudioYT = "ac906bb2-7492-42c1-99b3-324f9467e603.mp3";
export const chairPhonemeAudioYT = "f3d7b913-1c5d-4306-9b02-d390d66dfadd.mp3";
export const fishPhonemeAudioYT = "01ad2b85-75db-4f57-9867-4b50821a4f17.mp3";
export const pumpkinPhonemeAudioYT = "a73be606-455a-46d4-97e9-a5c7040ae282.mp3";
export const applePhonemeAudioYT = "8805e310-ab74-413f-ba88-761b9fc3a392.mp3";
export const piePhonemeAudioYT = "28ea41e4-54ee-4522-bb92-b1854a1cc591.mp3";
export const windowPhonemeAudioYT = "fbeee191-0424-4198-aba6-5d188a379c9f.mp3";
export const lollipopPhonemeAudioYT =
  "1ac624f2-495d-4d96-bf52-ead276d4bc02.mp3";
export const drumPhonemeAudioYT = "fd27767f-0cd7-4c16-8fe9-fbe2095ccd87.mp3";
export const nestPhonemeAudioYT = "2b658c87-9325-46ae-882d-ad9bfd8f984d.mp3";
export const orangePhonemeAudioYT = "b8cb62fd-50f2-4f0d-9156-4d1eed5d21be.mp3";
export const cloudPhonemeAudioYT = "71984b09-190b-4fdc-8096-c4b168ada080.mp3";
export const cornPhonemeAudioYT = "e28ca36f-661b-42de-b7dd-ae64dff8eb3e.mp3";
export const umbrellaPhonemeAudioYT =
  "7181b745-b09f-4680-94fa-bc752ae06585.mp3";
export const monkeyPhonemeAudioYT = "ae42e400-7d52-45de-83bf-f28baae77f09.mp3";
export const vanPhonemeAudioYT = "71f47d42-6e25-4d4f-9596-1b0cfe03e390.mp3";
export const iglooPhonemeAudioYT = "76572697-c5ec-4a51-83d9-bbef8381402e.mp3";
export const foxPhonemeAudioYT = "dafeeeec-3f20-4804-91c7-195424b5aa8c.mp3";
export const rainbowPhonemeAudioYT = "91fa4537-0b69-4830-bf10-aa56d229ff58.mp3";
export const treePhonemeAudioYT = "27d37270-d2b1-4505-9dea-7d16e7d7f08f.mp3";
export const treasurePhonemeAudioYT =
  "724508f5-c5b3-405d-bae7-d31d362bb37a.mp3";
export const coinPhonemeAudioYT = "c7131e3c-3d4b-4cf3-ac26-44cbde9ba1ab.mp3";
export const sawPhonemeAudioYT = "a242d2b6-c8e9-4672-be6a-5e6b406d09d6.mp3";
export const jamPhonemeAudioYT = "3b9c2371-4a60-49c8-8411-43be1b870041.mp3";
export const grapesPhonemeAudioYT = "a6eff47b-4a3a-4935-bcd9-958543aa26f1.mp3";
export const sheepPhonemeAudioYT = "78921841-6a6e-48a6-9a42-4ec3176bffe7.mp3";
export const hearPhonemeAudioYT = "b7a36c03-44c0-4082-b806-ab293a73d899.mp3";
export const beePhonemeAudioYT = "314486a1-8de7-40c3-96e4-090b8ee0fa90.mp3";
export const eggPhonemeAudioYT = "fd04ca68-9c1e-4924-9bf6-67cc6d17576e.mp3";
export const carPhonemeAudioYT = "319ef759-b656-4bcd-92e4-653e6ed8e57d.mp3";
export const handPhonemeAudioYT = "1b62af74-516a-412e-a049-28b6f4b6fc31.mp3";
export const singPhonemeAudioYT = "b8aa7950-7985-43d1-bac3-12773bcd762c.mp3";
export const sunPhonemeAudioYT = "97295ef6-ce46-4612-828e-7a3ca295129e.mp3";

export const CrowTwentyThreeImg = "7039f764-a61c-429f-9aba-890639d88161.png";
export const teacherEightImg = "d2d2ff47-a608-4cb0-ac67-41f3a26ce308.png";
export const peaOneImg = "e8711602-20dd-4dc8-9334-c14edd313865.png";
export const dogSevenImg = "b6b282c7-7095-40f8-849f-c39c2ebc5173.png";
export const orangeFifteenImg = "12802045-cff7-44e5-a12f-d36a9909117c.png";
export const appleOneImg = "f83e7d27-4bb7-4ff9-815a-bfdc39fb6198.png";
export const dogFourImg = "8a6e7ec1-913e-4893-865d-904a9b9eb24d.png";
export const tigerTwentyImg = "eda4132e-0599-41b1-9046-f7cd35a25885.png";
export const carrotEighteenImg = "ec2be172-44c3-48f8-9b28-2f89f16c2fbf.png";
export const busNineteenImg = "e3ab7e88-fb96-4b67-9789-a0e9a0838f78.png";
export const kiteFiveImg = "acacfe44-79a5-4f7d-a438-6ecb6bde7e0c.png";
export const penFiveImg = "b44ad14e-db23-45db-913c-6b44a17164d5.png";
export const queenSixteenImg = "3e6f790b-7a92-41f7-b9d3-50e027e993f2.png";
export const umbrellaTwentyOneImg = "f43e5389-ab25-4998-b28b-03aef23dbd02.png";
export const watchTwentyImg = "ed06a69f-fe5a-4791-86b0-77abbcafe0e3.png";
export const earthEightImg = "30df4040-68e0-4b2a-930c-b31b33fc7336.png";
export const LionTwelveImg = "a2e2d9c9-dd26-4eb7-b404-e65f6224bc18.png";
export const penFourteenImg = "7a25426c-4441-427e-a4f1-6f7253a98bdb.png";
export const tigerSevenImg = "c5c075e7-9124-4007-b0cb-57130dbad84d.png";
export const capSixteenImg = "bc3cdede-0e62-40e5-bdb4-f42c2c4eac5f.png";
export const plantTwentyImg = "0b88a768-2bc6-4a12-857b-5c5ac154dc23.png";
export const horseNineteenImg = "9f41d8ba-a727-4462-8379-b599e114671b.png";
export const goatSevenImg = "6acdec07-99d6-4e22-8bf6-f15404374f72.png";
export const rajTenImg = "8d3a4053-f9ee-4b23-b56a-2e5c231a7cf4.png";
export const girraffeSixImg = "759bd706-d765-40cb-8d80-20d40090ab09.png";
export const cubTwoImg = "decea96c-15ac-4b91-88db-09476e9dcda7.png";
export const yakTwentyFiveImg = "8edc33ea-fc3e-4d6d-b837-5c9b0803a479.png";
export const HoneyFourteenImg = "f0728d4d-66e8-4ae4-93e0-03a02651508f.png";
export const kiteElevenImg = "9d200529-4f86-43a4-b3d1-fe2fcc602524.png";
export const BookTwentyFourImg = "c3816e74-6e00-462d-b74e-7d79209d6d42.png";
export const brinjalTenImg = "97860ee6-7856-46c8-94b6-cebe38208871.png";
export const mosquitoSeventeenImg = "924b819f-12f5-466a-b1bf-5ef01c492c77.png";
export const NestFourteenImg = "a8292cbc-5e8e-42bc-920d-ef5a437f4a88.png";
export const GuavaTwentyTwoImg = "aa8fd151-5ad5-492d-b366-ae68d0140b02.png";
export const eggFiveImg = "a5e3a32d-0824-480f-b089-48841fd76850.png";
export const zebraTwoImg = "98376705-66ff-4974-b934-fa754ee01e2d.png";
export const swordTwentyThreeImg = "88b235ac-5d90-4fe8-b670-87a4f619ff54.png";
export const zebraTwentySixImg = "55712e35-97cc-4ac4-92e2-1174e0d36720.png";
export const KeyTwentyFiveImg = "efa597e1-68f8-4eff-bc53-2a7729bdf2c6.png";
export const LadduTwentyOneImg = "75508824-783a-41cb-998b-9dbae9833bb2.png";
export const DustbinTwentyOneImg = "7f77d88a-ee57-4822-a38e-fb49387ee4a3.png";
export const sunNineteenImg = "932a2d94-d50a-4b89-ad1d-dcaa22704009.png";
export const swordFourImg = "4a9aeab9-446b-414e-8ad7-a15cd6b1d97d.png";
export const pigNineImg = "d44bc567-ab2a-4981-b14a-b49c993e014a.png";
export const mangoThirteenImg = "45746d7b-258d-4ef8-8156-2dcf0540c5fa.png";
export const papayaTwentyFiveImg = "5699cb1c-9bbb-42b9-a6e9-b59dc22fcac9.png";
export const carEighteenImg = "9a022d9e-b689-424d-9f82-e89bef486563.png";
export const jamThirteenImg = "399fdf90-3734-4914-a0d4-ad795b6e4264.png";
export const catOneImg = "b5a39599-5775-4560-8fd7-c21c707af29c.png";
export const BalloonTwelveImg = "140c7eca-db28-4112-8fd2-eb7a7bb7fed7.png";
export const foxTwentyFourImg = "c610f7f2-a7dc-4a11-8ed3-715f48ed43a2.png";
export const lemonThirteenImg = "7025566e-4bfb-4206-b651-1702a140042e.png";
export const dhobiNineImg = "0b3fd1ed-6d46-458b-b7c5-bfa4db6ef7b4.png";
export const fishSixImg = "83cc685d-1e1b-4698-8e5e-7ad5c841a414.png";
export const bellTwelveImg = "01ad1df8-968d-4e7d-afc4-244bf806202b.png";
export const xrayTwentyFourImg = "8639ec61-af2d-4522-b0b3-559b20f7c334.png";
export const bookElevenImg = "e34a6ae5-5f9b-445e-8951-8fdbdb626882.png";
export const catThreeImg = "58b72554-5d0e-4ada-a0d2-604973678483.png";
export const VanTwentyTwoImg = "a47dd1cb-3a74-4b1c-8f49-61c316a251fa.png";
export const jamTenImg = "bf1a0eb2-fa55-4e72-b2d9-dbe7b28e6620.png";
export const iceThreeImg = "75b45194-1793-4531-9e5c-3659bcac2fd9.png";
export const monkeyElevenImg = "6365521b-8c95-4f03-9205-b61cb5bc154b.png";
export const LeafSixImg = "43333fd8-4232-4add-93e4-953f8df1f6b9.png";
export const ratEighteenImg = "c6c8c6c9-a43c-4575-89e9-e4c5b7c70e6a.png";
export const handEightImg = "c1500135-f677-4b94-95d9-6c3660d221ca.png";
export const garlicThreeImg = "438ceb95-be87-46ff-95dc-44e38859482b.png";
export const PuzzleTwentySixImg = "41169c67-fedd-4f34-b983-3a41393bb178.png";
export const ball = "42c3e65e-8667-4956-b860-c2547e0a43d7.gif";
export const window = "1f785e37-aad0-4a59-a13e-24265e312afd.png";

export const yak = "fd090f8c-0702-40d9-99e9-d1bbe75e014f.png";
export const sing = "b78ca4cc-05fe-4d65-8ee8-b3cab2056a6d.png";
export const saw = "7fa4a172-4165-4b1c-a46b-2713bab40572.png";
export const ballTwoImg = "94bcdb2e-6ea5-4b6f-a8bf-8ef12ba5e24f.png";
export const umbrella = "d62c6de5-d2f8-4035-81b7-6e7072af87fd.png";
export const barbecue = "470aa619-37f2-4389-9daf-148d67bdcb5e.png";
export const corn = "574ae541-f2ea-4fde-9aa1-5e2e9cc1f929.png";
export const chain = "6ccd5778-098f-4578-af38-fe3b692d4f51.png";
export const sister = "f4035b9e-7b13-4b79-9422-3df944a89aaf.png";
export const sheep = "551cee58-e9b2-4abe-ad1b-e8c1bad082c6.png";
export const igloo = "c97a2021-acd0-4b76-ac07-2f372083929c.png";
export const book = "60f9e94b-2e20-4468-af3b-704e2e2ddc98.png";
export const motherGif = "f40fa26f-0ff1-4f35-a638-a4572739e189.png";
export const boat = "37d3a5fc-2930-4613-a25f-2a386e68bd29.png";
export const bee = "aef5ce6e-afae-4cbb-8d0d-2f249bec0f44.png";
export const quilt = "39c1c701-44c3-4ef0-ad62-44965fbaa8c2.png";
export const star = "110c4502-8e8c-4c9f-b86a-e4b31689d31e.png";
export const fox = "eb1ac5f8-8c7f-43ca-8e56-c388ec9749c1.png";
export const hear = "762ec2a2-4e49-46be-a4b2-c04f3d2eeab6.png";
export const egg = "bed83726-832f-4090-be2c-b3c1cad76c62.png";
export const windowFourImg = "435db5bc-066b-4e7e-91b7-a51e317ce82a.png";
export const tooth = "453ed734-cc8d-41ce-bb82-b22b32f277a0.png";
export const cloud = "3b7fd608-3587-4895-b173-b78ddf6cf635.png";
export const windowGif = "1f785e37-aad0-4a59-a13e-24265e312afd.png";
export const chair = "0bedc1ea-acb0-49c1-bf5d-fcdf35547bdb.png";
export const coin = "0fcef35e-be34-438f-aa27-26bbf8333cb0.png";
export const jam = "b977561e-90ff-414f-8b80-4b5cd6341efb.png";
export const apple = "664cfadb-e7c1-4b7b-938d-94a11d0dd24e.png";
export const grapes = "0f20a751-5ed3-4603-83e8-76bbecd3a8c7.png";
export const hands = "89662c57-b8d9-497f-b9be-82a75a808620.png";
export const orange = "88c75884-0053-4c4d-b4ed-8c529794cbeb.png";
export const moon = "6ad3de93-0f5d-4644-ae12-06c431bdc89f.png";
export const pie = "5136ebc0-e568-4ae6-9226-bb7db1d00838.png";
export const van = "dff7b73d-8cc5-4ffc-846f-3783a48f51f6.gif";
export const lolipop = "f4fb9b99-3263-4da6-b0ef-4e73ab3579e1.gif";
export const tree = "2ae72801-0309-4d7e-bd76-480d1c3f1017.gif";
export const nest = "2e7c1d61-8ab7-4f5e-aeec-9701ce5dca76.gif";
export const car = "f2a92815-a9d8-4702-8849-f823c849d11e.gif";
export const monkey = "9a3ce608-fae5-4318-86eb-3064107716c7.gif";
export const sun = "576a56e4-159b-4d70-a27e-791fc9ff4280.gif";
export const pumpkin = "8adc18b7-6f32-4f5d-a762-5a871be506fe.gif";
export const fish = "20edd691-eece-458c-930c-748b5a0a9158.gif";
export const rain = "cb921941-5e59-4e4a-8501-4937520bb43c.gif";
export const rainbow = "df1cd94a-cb12-4384-a6ae-55174199d411.gif";
export const treasure = "3903bbf2-b1f3-48b1-9248-9b0b0c641dba.gif";
export const drums = "1bf29dc7-c3c1-40cc-b6f8-6ec43cf56bd2.gif";
export const ballGif = "42c3e65e-8667-4956-b860-c2547e0a43d7.gif";
export const zip = "141ac1fb-8acc-4ede-8396-f62722e413b7.gif";

export const RA15b = "20708332-4d36-414e-b9a8-e4eea555399c.mp3";
export const RA5c = "a9be99e7-3eb3-4cfd-abb1-60e9de7dce28.mp3";
export const RA5b = "1fa30ab1-1647-407a-8d25-65a533e193b2.mp3";
export const RA15c = "23e9e7d1-9971-4c93-b814-2747ef097c78.mp3";
export const RA9c = "3f087d0d-8452-404f-8ac3-f3d8e08861fb.mp3";
export const RA9b = "ca9a334b-1c9e-49bf-8d17-742be6647330.mp3";
export const RA8b = "670d3c40-ed45-4fc2-853b-0574d511b5bb.mp3";
export const RA8c = "5280ed3e-9962-4ed1-a137-2342dcee2321.mp3";
export const RA14c = "741cd828-c60e-407f-9567-c7656b2cf05c.mp3";
export const RA4b = "b5850761-4981-43ba-9734-c5e6dbe9756d.mp3";
export const RA4c = "1dad6374-93d0-4cf7-9f04-5a3949e08512.mp3";
export const RA14b = "6405441e-02aa-474a-81e8-b56aead42366.mp3";
export const RA13b = "df64f3d0-0bc7-4a2f-b544-7e73d7f186d9.mp3";
export const RA3c = "fa610da7-e950-4b49-b073-4df99c0c80ed.mp3";
export const RA3b = "d5036561-2576-41f1-85f5-30bf5da37c3f.mp3";
export const RA13c = "6458bbad-766f-4342-862b-03bd9d712019.mp3";
export const RA12c = "f27f7a72-ef53-4d7a-b455-97af4c13d781.mp3";
export const RA2b = "44dd38e0-1d40-45a5-8efb-ee4454f3a0f3.mp3";
export const RA2c = "87f01da7-9219-4472-b792-df903f768c08.mp3";
export const RA12b = "e7180d53-4047-4371-980a-3de4c26c94e3.mp3";
export const RA11c = "239c6341-f01b-4b21-a8cc-500caa58954b.mp3";
export const RA1b = "235e55cc-4c1e-4f28-bdf4-d2e5a2285333.mp3";
export const RA1c = "a84120ee-5ce3-47db-bfc0-119df7164f4c.mp3";
export const RA11b = "7409539d-0bb2-49c2-8df1-bc08bebea91b.mp3";
export const RA10b = "b04fd876-d7b2-4440-ad0c-b8107f706d5d.mp3";
export const RA1ato15a = "e889b97e-6df7-4253-88b7-84d6bc177985.mp3";
export const RA10c = "db8e3cfc-d368-4f2b-b865-fddd0483c2af.mp3";
export const RA7b = "8055d406-71ab-458a-88cb-44691d9ec60f.mp3";
export const RA7c = "05042044-f13b-42a7-ac42-04b412fdb603.mp3";
export const RA6c = "9fa7d586-c8a2-47fb-8ae0-fe313f291885.mp3";
export const RA6b = "57f4a960-12c0-4d6d-b3ec-6124eb766fc9.mp3";

export const R7_2 = "602b555d-bee8-4e7f-8872-e0740d038823.png";
export const R5_1 = "a1f58954-917b-49fa-8340-c94776cdea7b.png";
export const R7_1 = "48e2aec4-eab2-4606-8bbb-4689258767a2.png";
export const R5_2 = "320d2a53-124f-4237-8c2a-6285d1a0e58b.png";
export const R1_2 = "6d6010cc-abca-4741-802a-c81b6c29f9de.png";
export const R3_1 = "5e59a23e-158c-40a0-8135-cbc399493293.png";
export const R1_3 = "01714ddd-d373-49e7-9db8-df36381ce625.png";
export const R1_1 = "96e197fb-4132-454b-bc86-711040ee0b9f.png";
export const R8 = "7a9576ff-9369-4c97-9eb2-5d25ec75848d.png";
export const R9 = "936b8806-5335-46f8-a6cc-b495df067a2a.png";
export const R3_2 = "b475906c-20f1-453f-9561-171fe7436ed7.png";
export const R6_1 = "a1ed0c41-e416-4bd1-a7cf-7e7904585c14.png";
export const R14 = "feeb8fd6-f2b5-414c-9b92-c13348c47752.png";
export const R15 = "8957953d-efbe-406c-81a9-e42e85077707.png";
export const R4_2 = "4d64dedf-9897-4f68-8590-8ee06c9ed430.png";
export const R6_2 = "c9059f26-762c-4858-a8d3-e8033d292c3b.png";
export const R4_1 = "6535e0cc-d5f9-4b66-825d-1fca88d0545e.png";
export const R12 = "74b1cb29-899f-40eb-908a-2dacd1dcc850.png";
export const R2_2 = "ceaeb019-f6db-43de-bc3d-6a6e7857081c.png";
export const R13 = "30a202e9-f5cd-4e9c-bbe0-86b25ffa8d70.png";
export const R11 = "23bf77ad-7eef-49a9-a7a2-8300d7d0704e.png";
export const R2_1 = "addbd99a-fd79-4a2f-a5b9-75e3ba282431.png";
export const R10 = "1d7c2915-836a-48ff-900a-452fb08a8693.png";
export const R10_1 = "ec402d39-86de-443c-aa2f-a58f7f44c19b.png";
export const R12_2 = "6877c93e-65c3-45c6-b9a6-481fc018e2ab.png";
export const R10_2 = "af4a1333-2d59-4540-99b9-c139716f8e7f.png";
export const R12_1 = "696d4c7d-8227-49b2-9776-4fdc9321ec80.png";
export const R8_1 = "4ed96594-d069-4ecd-a47e-952d294da635.png";
export const R14_2 = "66ff57c6-f7ed-4ddd-a21c-14a53c153dbf.png";
export const R8_2 = "459409a2-d978-49d3-a6f8-1923ee52dae4.png";
export const R14_1 = "2961d801-eb4d-4cbe-8efe-afd04191f9fe.png";
export const R4 = "5eda1be9-81d6-4a43-8a6a-e56730fdaef7.png";
export const R11_2 = "ed4e7893-0750-4aab-88b8-8c46892dc50b.png";
export const R5 = "4523d961-ef4d-40ee-a829-10678f76e521.png";
export const R13_1 = "2247c168-bcfb-4be3-806e-0c46b6c246c7.png";
export const R7 = "136453a9-46c0-4277-baa7-756a2d604c96.png";
export const R11_1 = "38d11a7c-bd6d-4c13-85ba-d05379ec1f39.png";
export const R6 = "6db45d65-03ed-4f21-a489-cac58c5e3180.png";
export const R13_2 = "9ad513a1-88a6-4cd7-a220-9215b17ca7d0.png";
export const R2 = "84811ade-c50f-491c-b6ff-7680ad24208a.png";
export const R9_2 = "ee63530d-514e-4749-9a6a-beac7fb31856.png";
export const R15_1 = "2c866382-3c4b-492d-987e-d73aa4878223.png";
export const R3 = "1dae0011-b1a6-4768-9cd6-2a446c3e7595.png";
export const R1 = "e7f9320f-2735-4f06-b10a-f984b35739d3.png";
export const R9_1 = "094fbc32-e858-4cd1-97af-8acb80e0781f.png";
export const R15_2 = "5d28d025-3089-45d9-b396-c9aae36398b4.png";

export const leafAlpAudio = "1a0c6e70-d449-4059-9fb5-392af325fbc2.mp3";
export const featherAlpAudio = "d703a368-424b-492e-89d3-1bcac426b9eb.mp3";
export const assetMoneyAndJewelsAlpAudio =
  "dee29e31-c04b-488d-8a13-ba1420ba7551.mp3";
export const foxAlpAudio = "7e726331-f455-40b3-9c91-ade8b79d5911.mp3";
export const creeperAlpAudio = "36d5e551-2645-4d5f-b325-741cb7d0a5fd.mp3";
export const earthenLampDiyaAlpAudio =
  "b8df59b3-7c4a-4009-8894-85b89b1afb4f.mp3";
export const kiteAlpAudio = "f54dcf8f-e1e4-4218-8e7b-ccf8ce0870a7.mp3";
export const crocodileAlpAudio = "d2a6225d-6406-46f4-87fe-e363ef19d23d.mp3";
export const goldChainAlpAudio = "85146f6d-60e1-49bb-9b75-88d8c812b7ad.mp3";
export const bellyAlpAudio = "665b807c-e125-42d4-9283-c50d79f64782.mp3";
export const mathAlpAudio = "1f1921ab-28ea-4b64-9e91-b48219c27fc1.mp3";
export const kheerAlpAudio = "92c8c754-002f-4501-8ed5-2d9f1671f42a.mp3";
export const jewelariesAlpAudio = "474d14cd-3717-4735-a73e-7659613a3f5d.mp3";
export const mealAlpAudio = "35ef3070-c011-4ec1-ba46-950e49e8865a.mp3";
export const cow2AlpAudio = "8d4e8b40-e5c7-440b-a396-47854ba2e694.mp3";
export const fearAlpAudio = "8684920e-bd31-4dc5-b3dd-49d4b5ab5865.mp3";
export const fragranceAlpAudio = "f24202a4-d4b1-45a5-9526-cd830080fc0b.mp3";
export const jungleAlpAudio = "dd852efb-c61d-41d9-9271-c985a0545af5.mp3";
export const lotusAlpAudio = "97a38f2b-bb3e-4e74-8b54-ab8bee6acfcc.mp3";
export const manRingingTheBellAlpAudio =
  "b21faecc-64fe-45d7-96a2-40f18c3fe143.mp3";
export const hexagoneAlpAudio = "a3e36851-1dcf-4639-bb2b-aa18c7ac13f1.mp3";
export const fiveAlpAudio = "cbfec947-c575-4d64-b987-c560dc3d6d19.mp3";
export const medalAlpAudio = "0bd80d15-6aca-4ad5-8321-430b0a47096b.mp3";
export const chariot1AlpAudio = "7dfc0727-ccff-4a9d-847a-ee8120af8f05.mp3";
export const familyAlpAudio = "34c65d5b-0a61-488b-9924-5a65ea2a3ab5.mp3";
export const frontPartOfTheNeckAlpAudio =
  "3cebca03-bd60-4fd7-9c80-d8fbdcf23caf.mp3";
export const cowAlpAudio = "314607d9-6d68-4db9-b661-69fd80ccbb7f.mp3";
export const fingerAlpAudio = "048fae1c-e3e2-40d4-b152-92b2c5c68625.mp3";
export const countryAlpAudio = "88b0f2f9-906c-4811-ac0a-92bf9338b81c.mp3";
export const dreamAlpAudio = "77ecf439-5e32-4c64-8af8-e0a640fc8292.mp3";
export const camelAlpAudio = "9011a27a-927a-44d2-a577-d9720d69c6ff.mp3";
export const angryBoyAlpAudio = "d7db91c4-a94a-49ca-bf13-c08b3542e4e5.mp3";
export const cotAlpAudio = "e40005d1-ef0a-471b-bd8d-3787e0a4d579.mp3";
export const joyHappyAlpAudio = "6f0a9125-b154-416b-9d8f-639fa772bd79.mp3";
export const highschoolAlpAudio = "c046f540-ec64-4e37-80a4-cc4be841279c.mp3";
export const ladderAlpAudio = "e6913008-7b58-4bf7-99f9-6cce58f7d9b5.mp3";
export const greenPeasAlpAudio = "25dc5a02-7214-4aed-a222-418716e3f95c.mp3";
export const anOxOrBullAlpAudio = "b2e08305-86df-43d6-9df4-461431458a42.mp3";
export const hairAlpAudio = "c6c5ec4f-7db5-42d6-9e32-a76a0d94a707.mp3";
export const bellAlpAudio = "dc888d47-0fcc-4aa2-88a5-c9eb80d91a9b.mp3";
export const kingAlpAudio = "057dc4c7-febd-4a0f-9605-c867e80b9f18.mp3";
export const gaadhaNoImagAlpAudio = "d30f363a-e172-49a0-b3b1-50f707606abc.mp3";
export const fanAlpAudio = "cad1f181-50b0-4972-bcc1-e1cff95367e0.mp3";
export const fruitsAlpAudio = "587299dd-f51e-4370-8e13-e98078de7bbe.mp3";
export const maleSheepAlpAudio = "c78dbc43-10cb-4f44-94fd-3468474bc007.mp3";
export const elephantAlpAudio = "e0588408-f180-4012-9220-616da587c7c0.mp3";
export const associationAlpAudio = "fcd928f7-8336-4028-903b-773afb8605af.mp3";
export const lionAlpAudio = "a7ecfe42-4bdc-459c-8f64-18682c28207a.mp3";
export const boltAlpAudio = "b50411a0-227b-4263-a510-84164c8d00bc.mp3";
export const chariotAlpAudio = "8d3baecc-da3e-42d4-861f-ed6191666a8a.mp3";
export const runningAlpAudio = "c27e8576-f5cd-44ce-aa6a-f79f6f73b3b7.mp3";
export const rockSaltAlpAudio = "bcafb356-d716-4ff1-a960-a47a95a9ac12.mp3";
export const phlegmAlpAudio = "8e87c582-0175-40a5-b5f9-145fd1a58fb5.mp3";
export const oceanAlpAudio = "59126c40-1073-4838-b31a-259f6708b64e.mp3";
export const medicine2AlpAudio = "770ae1fb-08fb-48ec-9c19-2fce6cc7e7fa.mp3";
export const swimAlpAudio = "890b5c0b-e09c-4cd0-b0bd-d6b31a102d33.mp3";
export const shiningNecklaceAlpAudio =
  "8c7eef30-3729-4f01-843c-e24f7e8aac53.mp3";
export const snakeAlpAudio = "08ccc274-a639-4bcb-a3b0-473ee6f5b022.mp3";
export const peopleAlpAudio = "4fd1736b-d2f3-45fc-a3c8-9d97674a96ac.mp3";
export const vehicleAlpAudio = "07b7f672-a01e-48c6-8c4b-df218cb66dc7.mp3";
export const playAlpAudio = "091f3def-6b32-4a69-a6fb-a13c33a65053.mp3";
export const swordAlpAudio = "eb9b822f-2182-4437-8ac6-680e99e48cb8.mp3";
export const windowAlpAudio = "5ec1a14d-44a5-4938-a50a-b4c5af1809fd.mp3";
export const tabalaAlpAudio = "8cb24205-349c-4678-ae0e-711ce02af7c4.mp3";
export const moonAlpAudio = "21db8c9a-40d0-4ff3-b153-202fd832a19b.mp3";
export const shakingWithFearAlpAudio =
  "07094176-161c-4e3d-bdd1-8fed2cad14a0.mp3";
export const shivaGodAlpAudio = "e5f5c8cc-6488-48bc-bb71-63d32affe0f0.mp3";
export const wolfAlpAudio = "f1e07bfc-8c5f-4fa4-b438-6724b33da5f6.mp3";
export const mouseAlpAudio = "121abb31-d8d6-4188-9357-d7852e9313c3.mp3";
export const washermanDhobiAlpAudio =
  "e1b6b280-5665-4bfb-bfc8-c6a67fe331cc.mp3";
export const skyAlpAudio = "01ec453e-be20-40f3-8649-ef384ac6a41e.mp3";
export const moneyAlpAudio = "7544ad70-a8f8-46a4-b769-03b74f10a0ea.mp3";
export const treeAlpAudio = "bcd38151-6e88-4edc-ab34-7cf69691aac3.mp3";
export const tenInASetAlpAudio = "e19fc090-cf86-4241-b940-80380a309658.mp3";
export const roomAlpAudio = "32d2c27d-ea31-45ba-8ce4-cdf24b2bb8c2.mp3";
export const wednesdayAlpAudio = "9818822c-1ad8-4763-81b3-cf8284fc563d.mp3";
export const swanAlpAudio = "92985fd7-8b2e-419d-88a0-024c66afaec4.mp3";
export const yellowAlpAudio = "e6690575-2179-43ac-aefa-9e0455de5e39.mp3";
export const yamaAlpAudio = "6a68bce3-f147-4817-965d-5cc6434408e9.mp3";
export const palmAlpAudio = "dbf83295-b1ec-4837-8a1b-ca3b7ce8dd8b.mp3";
export const seedCornGrainAlpAudio = "8dd35eb5-11f4-4fcc-a127-c8ccbc2ccce7.mp3";
export const sageAlpAudio = "d07dc6c9-d535-43f7-8396-9f2c2f2d13ba.mp3";
export const shopAlpAudio = "f8119d3a-56cc-49a4-a592-588f7dfbbd49.mp3";
export const purushaManAlpAudio = "5aca5100-a399-42a3-a24b-0e0f6047944d.mp3";
export const medicineAlpAudio = "d84594a8-7ee4-4eb8-b3bc-2230bf4f975d.mp3";
export const solarPanelAlpAudio = "d3d6d95d-0aa9-42d9-ac0a-6f47185033fd.mp3";
export const snowAlpAudio = "5ee53bd3-afe2-46a4-8501-21721efd873d.mp3";
export const smallBoxOrChestAlpAudio =
  "e6acee39-68e5-4288-a833-b83b0c2bd7d1.mp3";
export const plantAlpAudio = "a3c59c02-1fcd-4fe7-89fd-6e4f3d690b43.mp3";
export const namasteAlpAudio = "4c6c7577-2670-4466-b9e2-6b22d8d1c071.mp3";
export const rabbitAlpAudio = "532ee197-96b0-450c-9600-30c0f10211a6.mp3";
export const spoonAlpAudio = "a0ce9f7d-0b6b-43dc-a6c9-d132d169c3f9.mp3";
export const paperAlpAudio = "f9ca6881-317e-4333-90ee-f0354b0b2384.mp3";
export const shoulderAlpAudio = "ee3f1795-42c5-4e53-8622-a4e710334136.mp3";
export const penAlpAudio = "064d7bae-3f7b-4704-b3f6-7850e8909755.mp3";
export const tabalaaAlpAudio = "548b92c4-c2c0-4efb-8fa5-9e11e18c32c0.mp3";
export const thiefAlpAudio = "b5f90d89-de31-4c76-b599-80226700d4b9.mp3";
export const weaverbirdAlpAudio = "8e34a777-2640-4afc-b3ed-fde6768916fc.mp3";

//images

export const fingerAlpTelImage = "4e41171e-12eb-412d-a750-311fde646f30.png";
export const moonAlpTelImage = "174f0531-f145-4045-bcd0-b031bd5c4d6c.png";
export const shivAlpTelImage = "e6079819-d66d-45be-a68b-83710fcd513b.png";
export const ratAlpTelImage = "feff971d-c169-4668-969d-4f635e6b4d9a.png";
export const countryAlpTelImage = "7fab8475-045d-46a5-b77a-8c982575ec43.png";
export const familyAlpTelImage = "06f51a5a-7d95-449b-a38e-5a31163ed3dc.png";
export const yamrajAlpTelImage = "58853b62-d17f-459f-ba31-4008567871b8.png";
export const fruitAlpTelImage = "46b7f782-e11a-48d6-ac27-1a992357af88.png";
export const swanAlpTelImage = "01fd62db-a703-4e8c-b57d-11e07ba031c1.png";
export const treasureAlpTelImage = "69396d88-9c33-47f7-b6b8-eba9ffd1680d.png";
export const lotusAlpTelImage = "e745d4ff-5613-4671-af81-9842ce86ed3d.png";
export const foodAlpTelImage = "0141dc70-5bb9-452e-a19f-a128edab2a34.png";
export const colorpencilAlpTelImage =
  "d8549b66-fab3-4c1c-ae94-8256631db89b.png";
export const horsechariotAlpTelImage =
  "e5206af3-810d-4348-83a0-0c5193c155dc.png";
export const swordAlpTelImage = "88796552-7a16-4b9c-ac03-cfab609cd3d2.png";
export const drumAlpTelImage = "0e9e8c57-0509-4d4a-8586-01a9e3841b12.png";
export const hexagonAlpTelImage = "2cd99ca5-9c96-4d5a-91c9-5f5c3125b506.png";
export const necklaceAlpTelImage = "1dbc4083-68a5-4b0c-bd34-82b298936b81.png";
export const fiveAlpTelImage = "26cea228-bf75-4075-a0aa-c3fcd0707bab.png";
export const jewelleryAlpTelImage = "8856c235-bb2a-4eb8-9e63-b5a5dc005b33.png";
export const happyAlpTelImage = "08dab3fe-c865-4e38-ad51-d1dd06308e6d.png";
export const childrenassociationAlpTelImage =
  "e534c038-60da-44d9-90b6-00ee33e693f4.png";
export const fanAlpTelImage = "c991bcc4-0d7f-4919-890d-31c62fb638c2.png";
export const thunderstormAlpTelImage =
  "f931eb29-359c-4c36-8300-de325d9eedb1.png";
export const monkAlpTelImage = "1607cce6-6288-45de-96ff-8217c4dc1d88.png";
export const birdAlpTelImage = "b02aca59-0376-4de2-9cce-a077b9db0a73.png";
export const leafAlpTelImage = "eea77b2a-f2a2-49b5-a46e-b3ee6ddfc917.png";
export const kingAlpTelImage = "4f379beb-f279-4da7-b88a-56ae3f1f8f73.png";
export const cerealAlpTelImage = "7dfae44d-906e-4045-bcef-48aa1e08fb05.png";
export const fragranceAlpTelImage = "87cc656d-5a20-4afe-901e-386abc700dec.png";
export const weplayAlpTelImage = "8cf1c600-16c2-4c89-a46f-cf8bc7bf72b1.png";
export const fearAlpTelImage = "8d42c984-ef45-4f05-a4f5-27bb88c84e59.png";
export const foxAlpTelImage = "cad89d2f-5895-463a-9ade-a5fd3cb33682.png";
export const featherAlpTelImage = "a7a01039-7e0e-4144-b2c6-5399545344e4.png";
export const hairAlpTelImage = "fe2ab25f-06b0-441a-928a-db166e025c95.png";
export const lionAlpTelImage = "9392ed88-625b-4c08-928c-642a1c168b94.png";
export const windowAlpTelImage = "19980eb7-1975-406e-8197-ac40d82136da.png";
export const kiteAlpTelImage = "d1596a61-011f-425a-b4bc-8431c072d968.png";
export const schoolAlpTelImage = "81aab210-6c49-4f56-9e13-ea8227f8e16b.png";
export const medicineAlpTelImage = "58b14867-8dc9-4797-8229-1ca9ee474117.png";
export const coinAlpTelImage = "1e05c89e-d93c-48cd-8626-e2d34b354ee2.png";
export const mathematicsAlpTelImage =
  "53ed7494-b7e6-4e0f-a5b7-e7f5ce89fe83.png";
export const coughAlpTelImage = "ee9cc62b-0312-4eb1-90cd-a7d63f593237.png";
export const sheepAlpTelImage = "5ebd3471-7774-46e1-a7d3-61efa82056f4.png";
export const manAlpTelImage = "631a44eb-2187-454e-bbcc-98004113b060.png";
export const peonAlpTelImage = "30ac3c0a-5150-4943-855e-d57893de71a9.png";
export const solarAlpTelImage = "bcd68769-350b-43c0-8b23-8f640e38b66e.png";
export const peasAlpTelImage = "87de9f6b-5204-4705-a573-3b4cb9959084.png";
export const pranamAlpTelImage = "55ce1248-16e2-4e43-abd4-260f6e3d5a78.png";
export const stewAlpTelImage = "2cf2c9bc-69f6-42fc-b9eb-7c38202d3200.png";
export const plantAlpTelImage = "7042677c-21d3-4dfb-8629-9c970b1b74c4.png";
export const crocodileAlpTelImage = "81462991-970b-4f7d-93e1-d66a4394cbcc.png";
export const spoonAlpTelImage = "4eeb5ded-7c95-4b98-8541-f11d7185674c.png";
export const beachAlpTelImage = "38780657-557e-4471-afb5-252eb508c39a.png";
export const candleAlpTelImage = "525fb136-fc31-404e-beac-ecc2f63bf046.png";
export const shoulderAlpTelImage = "a29f4199-e57b-4d7b-afec-8979083484e1.png";
export const elephentAlpTelImage = "bb82ad72-0cc2-49f2-a506-95c105265c06.png";
export const yellowAlpTelImage = "ce1282f0-e52b-4bb1-88e5-cae06be683a0.png";
export const saltAlpTelImage = "c3d3a849-781f-48a9-9a8b-0c1b5928793b.png";
export const treeAlpTelImage = "4cf124a2-bc27-4dec-a63e-f070551d822e.png";
export const peopleAlpTelImage = "e77999c7-1524-4440-9707-8c4d4b0a1ca1.png";
export const rabbitAlpTelImage = "c1d9146a-2e12-457b-b84c-e7830c722ccf.png";
export const cowAlpTelImage = "04a83da3-a1d9-4ddc-a77d-6cd53fe257a4.png";
export const angerAlpTelImage = "acbda781-1dd1-40e4-b275-e34c42f0dc83.png";
export const swimAlpTelImage = "8470766e-10ca-437b-871a-2ea9d626800d.png";
export const wednesdayAlpTelImage = "84d7753a-bec9-4054-9376-5e2dfc41986d.png";
export const parrotAlpTelImage = "3b547c70-f8fc-49e4-9743-ff07a81adc1c.png";
export const snowAlpTelImage = "7dc423e8-2894-4711-a1af-ca58a5255c7a.png";
export const bellyAlpTelImage = "7b315f27-2f6e-4da8-8102-b567153655e4.png";
export const bullAlpTelImage = "3f22de14-e65c-45e4-ac4a-e0d3ebb03b67.png";
export const tabalaAlpTelImage = "830d0adb-c5b1-4b91-830b-d12a10162a44.png";
export const snakeAlpTelImage = "ae0f04f8-4ca1-42a7-9387-99a87529c425.png";
export const camelAlpTelImage = "5e6a9174-e884-472d-9869-7cbc8f639ee1.png";
export const dreamAlpTelImage = "d3a8ec04-90b9-4ea7-937f-fce881f41605.png";
export const penAlpTelImage = "6533b3e2-e720-4792-aefa-b27690a9c95b.png";
export const forestAlpTelImage = "9fd9f701-c9f9-4784-987b-a9bcd86045c9.png";
export const skyAlpTelImage = "442d99d0-77aa-4bcf-84b2-93261afde1c9.png";
export const bedroomAlpTelImage = "39a0b5b1-75dd-444f-a3c9-1366041b8c3c.png";
export const carAlpTelImage = "b3942546-0c28-48a9-bfd0-5b9042a20562.png";
export const shiverAlpTelImage = "b26193c5-936b-4be0-b44b-ffdb845d8a08.png";
export const neckAlpTelImage = "0f4c9b34-671d-484d-97a6-3ff5182782dc.png";
export const boxAlpTelImage = "601e2943-c870-4dd8-9109-1af83476d37c.png";
export const stomachAlpTelImage = "3bd29efc-cd7e-476f-a6bf-ae7b9c62a6e0.png";
export const medalAlpTelImage = "97469169-e61d-4042-8657-1929b96c841f.png";
export const paperAlpTelImage = "f1b108b7-5cd1-428c-8198-b5b6100205d0.png";
export const runAlpTelImage = "fb5bb38e-d329-4631-a897-a2cc9d57b3cd.png";
export const stairAlpTelImage = "1987c556-46e7-4fe0-ac66-c97b1a1b86a3.png";
export const couchAlpTelImage = "58d17ace-20cf-4504-b0de-5706604f84b7.png";
export const bicepAlpTelImage = "75d35179-e97b-4fec-aa32-b8aadcadc1bb.png";
export const sheSingsAlpTelImage = "9be3f2de-f286-450e-85ca-fd634ea8829c.png";
export const tinklechainAlpTelImage =
  "1c6e6bdd-b4ee-4fa0-aa50-1a6c4dae5469.png";

//short audio

export const am14thAlphabetAudio = "7906e497-d33a-47a5-8406-a8ecb354d497.mp3";
export const aiWordWithFiveImageAudio =
  "03941325-bd2d-436a-b38c-296fc2381d64.mp3";
export const alphabetWithYellowAudio =
  "73050c1c-96eb-4755-aa0b-030ee1c3fa5b.mp3";
export const dhaAlphabetWithSchoolBellImageAudio =
  "ec5de7f6-d57b-4016-a88b-c9490392d019.mp3";
export const aa2ndAudio = "f8f89849-417b-4ddd-8739-c105f2ee1aa2.mp3";
export const alphabetWithScaredBoyAudio =
  "d74c958f-0d96-41ff-a87d-3e5c230e8a83.mp3";
export const chaWordWithSpinningImageAudio =
  "16d11596-1541-4cfe-b1df-2be0b7c68db9.mp3";
export const alphabetJungleImageAudio =
  "1446aa62-ffb1-434e-8b38-54c86903ac63.mp3";
export const auWordWithMedicineAudio =
  "62bb9d18-6f69-4e2a-bb34-a9554cd908c4.mp3";
export const dabbaWordForContainerImageAudio =
  "441fbda2-5945-4800-8835-82a7cb839c92.mp3";
export const jna5thLetterInTheChaSeriesAudio =
  "8df77f63-7c4d-47ac-97ee-403f5c7d803c.mp3";
export const gaWordWithFeatherAudio =
  "2d50202a-3fe9-48e6-9149-1c841449473a.mp3";
export const e8thAlphabetAudio = "2472b729-c4e2-4c39-b480-470fad0c948b.mp3";
export const alphabetCreeperImageAudio =
  "c94eeccc-89ce-4dec-a467-a14bde879caf.mp3";
export const jaWithPeopleImageAudio =
  "f07b321b-1c3b-4514-a049-3cfb9b0df90b.mp3";
export const alphabetHexagoneAudio = "9d576b60-635e-4927-b8d8-133bd3897487.mp3";
export const alphabetWithFruitsImageAudio =
  "aea35287-43ca-486f-8d85-cadd7bad437c.mp3";
export const jhariWaterfallImageAudio =
  "ee652b3e-5be2-48bc-b7ee-df7c19880d5a.mp3";
export const au13thAlphabetAudio = "bedd1b90-360d-4ead-8b28-ba5121e25073.mp3";
export const ai10thAlphabetAudio = "b10a224a-8fb8-46c3-8395-c2c196ec4cf3.mp3";
export const dhaWordWithAssetOrMoneyImageAudio =
  "8d659158-3771-43e4-a524-71560f674297.mp3";
export const baAlphabetBangleAudio = "852483ed-a53d-455c-8533-35b07aa7103a.mp3";
export const i3rdAlphabetAudio = "a4ed004d-d4e7-4dbe-8c7a-44c4e4faee17.mp3";
export const iWithWordMouseAudio = "7fed130c-1255-422d-ab43-e26b278e309e.mp3";
export const jaAudio = "26ed41f2-46f4-4897-955a-31d2f4b96f7c.mp3";
export const dhanaDhanaWordWithSchoolBellRingingImageAudio =
  "e552f602-4de9-490d-a333-a38898069fb5.mp3";
export const aha15thAlphabetAudio = "871db23c-80d4-4346-b678-b8f5d8315c67.mp3";
export const alphabetWithCowAudio = "13c1ce61-5fb8-4bef-8f96-85ed47d59452.mp3";
export const eeWordWithLadderAudio = "e1cdbc0e-7a6d-4b27-b1e9-92e93e735fbb.mp3";
export const ghaWithWordBellAudio = "20e03f18-fdf8-4a21-9ebf-100694ead99e.mp3";
export const ee9thAlphabetAudio = "8c22a072-6c77-4083-a2c3-b4a20e00f2a2.mp3";
export const gaAudio = "5aedd951-a800-46c2-9bc8-7f9c2ad195be.mp3";
export const daAlphabetWithMysoreDasaraImageAudio =
  "f5c7e8e9-0332-4ecd-b984-147a9a88b346.mp3";
export const aFirstAlphabetAudio = "9fa57118-60a6-4ed4-8edb-31e1a4bb9868.mp3";
export const cha2ndChaAudio = "afd44725-b588-421b-bd38-f99a84dabca8.mp3";
export const jnaTheLastOneAlphabetAudio =
  "6540d968-ac72-4217-b549-6acba5d95776.mp3";
export const alphabetTreeImageAudio =
  "ae71b5cc-77b0-4d16-8de6-d3d3900a4c24.mp3";
export const chaWithUmbrellaImageAudio =
  "938d7d9c-9c9e-4acb-8b3e-f1265b1dc03a.mp3";
export const hanaWordWithMoneyImageAudio =
  "46832937-356d-43a6-ba87-b38272baa369.mp3";
export const ghaAudio = "16e3c56a-1e4c-479c-a42b-1f5c054142b1.mp3";
export const daAlphabetWithContainerImageAudio =
  "47418124-611e-48cb-bedc-8a1128660130.mp3";
export const ii4thAlphabetAudio = "47d62cfe-20f1-4501-aefa-a514c1e7e124.mp3";
export const aWithWordKingAudio = "b9bf6e02-4edf-4486-8a2e-53301687df95.mp3";
export const jhaAudio = "4f466045-8b81-47a9-a5f8-2806c37cd087.mp3";
export const aaWithWordElephantAudio =
  "2d707b9a-fca9-4c0f-88f4-69612161f154.mp3";
export const chaAudio = "ecdce644-ba36-4f3f-9a5e-b1b1262d907d.mp3";
export const iiWordSwimAudio = "3307e35d-f7bb-478a-8330-228f04d0ab1f.mp3";
export const eWordWithLeafAudio = "00329a6e-5bb2-4366-9a1a-198d4a0f6d86.mp3";
export const amWordWithShopAudio = "daaf5834-cc74-4dc6-8f9b-cc52307c024b.mp3";
export const saAudio = "c504e802-3ae5-4dea-8127-39d3788cc6b1.mp3";
export const SHAAlphabetHexagoneAudio =
  "9d576b60-635e-4927-b8d8-133bd3897487.mp3";

export const wordWithCowAudio = "1013f5d5-ec16-42b3-8ede-1087e1e3daf1.mp3";
export const kshaAlphabetTeacherImageAudio =
  "272104b3-a43f-422b-b554-cdb53002c591.mp3";
export const moneyImageAudio = "3c06850b-2cf3-4302-bc82-81443eacc1f6.mp3";
export const kaWordBearAudio = "cf734fe7-d5dd-4b47-8a33-0871b521dd42.mp3";
export const u5thAlphabetAudio = "57a40716-3513-4152-a0aa-7d6f1e922c47.mp3";
export const wordWithYellowAudio = "253c1d0e-0fea-466f-871e-b4ae764542aa.mp3";
export const wordWithFruitsImageAudio =
  "96db0763-4993-492e-906c-159b2099bf0f.mp3";
export const taAlphabetWithThiefAudio =
  "85275bac-f325-47a4-97ee-a6204a9090ef.mp3";
export const wordMoonImageAudio = "43de657a-118f-4b8e-b17d-23575d16b9d9.mp3";
export const oWordWithCamelAudio = "30110403-1c44-4dde-8172-753ffd4aef1b.mp3";
export const thakkaWordWithThiefImageAudio =
  "ca49bca3-6395-470e-a354-00bfc3d13aa4.mp3";
export const wordWithGlitteringChainImageAudio =
  "eac96cc9-a4fa-4204-adfa-c857c03c5d50.mp3";
export const naAlphabetWithFoxImageAudio =
  "ac29536d-5c4e-4154-9879-9945d54c4880.mp3";
export const paAlphabetWithCrackersAudio =
  "4c07f234-632a-4c2b-a1bd-bda8adc543c7.mp3";
export const khaAudio = "d5e29a8c-754e-4c2e-b02e-0b7f65320de9.mp3";
export const uu6thAlphabetAudio = "a6b4a1bb-d237-4388-b0f9-f5cdcdb15661.mp3";
export const raAlphabetChariotAudio =
  "8c73a825-f48f-447f-a916-daea723c559b.mp3";
export const naAlphabetWithMoneyImageAudio =
  "004412f7-7404-400e-a6bc-34637c2384ac.mp3";
export const wordJungleImageAudio = "a54bc4e3-e40a-4a80-990e-b2253a8ba8ad.mp3";
export const ru7thAlphabetAudio = "42c432dc-fbbe-452a-a517-c4b77d467b42.mp3";
export const saWordWithGoldChainImageAudio =
  "3a66001e-8828-4d56-9110-553b882b0532.mp3";
export const khaWithSwordWordAudio = "697a54a7-4b44-4396-9364-1a72b1ac5b75.mp3";
export const oo12thAlphabetAudio = "98839aa9-8e57-48d9-85f4-f07ea2ee51c1.mp3";
export const wordWithScaredBoyAudio =
  "4a0eebac-4c01-47a2-b52c-dc7aa83406d5.mp3";
export const wordFor5thLetterInKaAudio =
  "9cbb790b-fd5d-438e-9bf5-dfa176ac8eef.mp3";
export const taAlphabetWithHeadImageAudio =
  "7c86aed0-383b-4f1a-9728-fadb37935f3d.mp3";
export const wordForChariotAudio = "377a2db7-619d-428d-9ce1-23d190c7fd93.mp3";
export const ooWordWithRunningAudio =
  "0366b325-70e7-4a4d-b638-f4ac84517114.mp3";
export const wordWithMaleSheepAudio =
  "0f8c8b38-67d1-47e1-809e-7fda1227cfd4.mp3";
export const wordCreeperImageAudio = "baea241b-1dbb-4364-8837-999c4ae27503.mp3";
export const shaMoonAlphabetAudio = "fea75236-8160-4044-a7f3-4f86048b0c65.mp3";
export const thaAlphabetWithGlitteringChainImageAudio =
  "1b0d77c1-f1f9-4793-ab0b-2d3dc1f07e27.mp3";
export const wordWithYamaImageAudio =
  "0a524844-2ee6-42ef-b4f7-a38706ded5ea.mp3";
export const ru7thAlphabetMonkImageAudio =
  "6774b432-a6fb-402b-be71-680c5bf94487.mp3";
export const yaAlphabetYamaAudio = "0a1f6d47-7d1d-449d-97e8-248fec83ae8d.mp3";
export const uWithWordBellyAudio = "459eeef8-9db1-4e50-80f9-dc4d389084d9.mp3";
export const wordHexagonImageAudio = "4a276dc6-456b-4f78-a585-3a1961dd193a.mp3";
export const wordWithFoxImageAudio = "d5284af2-6617-4191-bff6-8a38da4ad5fb.mp3";
export const uuWithWordMealAudio = "af1b365f-30b0-4e21-b846-587289b40b75.mp3";
export const o11thAlphabetAudio = "8a8967fc-4625-4123-85c8-28f88181bc30.mp3";
export const jnanaKnowledgeWordAudio =
  "f40780da-f164-4c62-8c60-fbcf64634c45.mp3";
export const kaAudio = "050a0c8b-beb5-4742-ad90-44d133b4278d.mp3";
export const saAlphabetGoldChainImageAudio =
  "c504e802-3ae5-4dea-8127-39d3788cc6b1.mp3";
export const wordTeacherImageAudio = "b1665ff1-b4d7-4bf6-83cb-e09ad03965bb.mp3";
export const knowledge5thLetterInChaSeriesAudio =
  "409ca28e-d0f1-4a5d-a2af-c2b71c8a9362.mp3";
export const wordWithMysoreDasaraImageAudio =
  "dc27ec89-0abd-4d83-b9a6-024608fd8556.mp3";
export const wordWithCrackersAudio = "b6e0800a-86ac-4c26-8e31-2670fbcc48ba.mp3";
export const taleWordWithHeadImageAudio =
  "f56646b7-d25a-442c-82f7-f0442f0342d0.mp3";
export const nga5thLetterInKaSeriesAudio =
  "4908d6f3-1ff8-460d-b5e5-b5a02d3fe84c.mp3";
export const wordBangleAudio = "e848fb2b-3d8f-4e2d-a9f2-8c07de3005ff.mp3";
export const wordWithTreeAudio = "7b4dc912-0156-4b69-96d4-13d734c97823.mp3";
export const ta3rdSeriesInKaAudio = "8f4fdf14-3049-4bd6-8add-e4cf6f908855.mp3";
