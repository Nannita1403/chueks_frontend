import { Routes, Route } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import UserLayout from "../UserLayout.jsx";

// Páginas internas
import ProfileDashboard from "../Profile/ProfileDashboard.jsx";
import OrdersPage from "../Order/OrdersPage.jsx";

// Modals globales
import AddressModal from "../../../components/Profile/AdressesModal.jsx";
import PhoneModal from "../../../components/Profile/PhoneModal.jsx";

const ProfilePage = () => {
  // control de modals globales
  const {
    isOpen: isAddressesOpen,
    onOpen: onOpenAddresses,
    onClose: onCloseAddresses,
  } = useDisclosure();

  const {
    isOpen: isPhonesOpen,
    onOpen: onOpenPhones,
    onClose: onClosePhones,
  } = useDisclosure();

  return (
    <UserLayout onOpenAddresses={onOpenAddresses} onOpenPhones={onOpenPhones}>
      <Routes>
        <Route path="/" element={<ProfileDashboard />} />
        <Route path="orders" element={<OrdersPage />} />
      </Routes>

      {/* Modals globales */}
      <AddressModal isOpen={isAddressesOpen} onClose={onCloseAddresses} />
      <PhoneModal isOpen={isPhonesOpen} onClose={onClosePhones} />
    </UserLayout>
  );
};

export default ProfilePage;
