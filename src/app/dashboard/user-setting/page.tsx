import Security from "@/components/user-setting/security";
import TastySetting from "@/components/user-setting/tasty-setting";

const UserSetting = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
      <Security />
      <TastySetting />
    </div>
  );
};

export default UserSetting;
