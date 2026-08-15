import { QurbanParticipant } from '../../types';

export const QURBAN_PARTICIPANTS: QurbanParticipant[] = [
  { id: 'QRB-001', participantName: 'Kelompok H. Zamzami (1/7 Sapi Limosin A)',
    animalType: 'Sapi', groupName: 'Sapi Limosin A - 380 Kg', phone: '0812-9988-1122',
    amount: 3800000, paymentStatus: 'Lunas', couponCode: 'KPN-SP01-01', isDistributed: false },
  { id: 'QRB-002', participantName: 'Ibu Hj. Hendrawati', animalType: 'Kambing',
    phone: '0813-7766-5544', amount: 3500000, paymentStatus: 'Lunas',
    couponCode: 'KPN-KB01-05', isDistributed: true },
  { id: 'QRB-003', participantName: 'Bpk. Dr. Kurniawan', animalType: 'Domba Super',
    phone: '0811-4455-6677', amount: 4200000, paymentStatus: 'DP',
    couponCode: 'KPN-DB01-02', isDistributed: false }
];
