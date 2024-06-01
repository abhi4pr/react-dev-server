import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetIndividualSaleBookingQuery } from '../../../../Store/API/Sales/SaleBookingApi';

const SalesBookingDetails = () => {
    const account = useParams();
    const { data: SalesData, error: SalesError, isLoading: SalesLoading } = useGetIndividualSaleBookingQuery(account.id);
    console.log(SalesData, account);
    const lol = { "success": true, "message": "Page states details retrive successfully!", "data": { "_id": "66584f83d249c76c6524e04a", "account_id": 18, "sale_booking_date": "2024-05-30T00:00:00.000Z", "campaign_amount": 5000, "campaign_name": "test_user_updated", "brand_id": "653fbab9d4ec95ae9e876480", "base_amount": 30, "gst_amount": 180, "description": "add new booking", "credit_approval_status": "approved", "reason_credit_approval": "660e77d6d83f9cce30f8b783", "reason_credit_approval_own_reason": "own reason", "balance_payment_ondate": "2024-05-30T00:00:00.000Z", "gst_status": true, "tds_status": "open", "Booking_close_date": "2024-05-30T00:00:00.000Z", "tds_verified_amount": 50, "tds_verified_remark": "done", "booking_remarks": "success", "incentive_status": "incentive", "payment_credit_status": "sent_for_payment_approval", "booking_status": 1, "incentive_sharing_user_id": 712, "incentive_sharing_percent": 5, "bad_debt": true, "bad_debt_reason": "done", "no_badge_achivement": true, "old_sale_booking_id": 18, "sale_booking_type": "normal_booking", "service_taken_amount": 50, "get_incentive_status": true, "incentive_amount": 200, "earned_incentive_amount": 150, "unearned_incentive_amount": 50, "payment_type": "partial", "final_invoice": "50000", "created_by": 712, "record_service_file": "file-sample_150kB.pdf", "createdAt": "2024-05-30T10:05:57.931Z", "updatedAt": "2024-05-30T10:34:03.726Z", "sale_booking_id": 1, "__v": 0 } };
    console.log(lol);
    return (
        <div className='SalesBookingDetail'>
            <h2 className='mb-4' style={{ color: "var(--medium)" }}>SalesBookingDetails</h2>
            <div className="row">

                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">

                    <div className="card w-100">
                        <div className="card-header">
                            <h4 className='card-title'>{lol?.data?.campaign_name}</h4>
                        </div>
                        <div className="card-body">
                            <div className="account-detail">
                                <div className="detail-view">
                                    <div className='details'>
                                        Campaign Name: <span>{lol?.data?.campaign_name}</span>
                                    </div>

                                </div>
                                <div className="detail-view">
                                    <div className='details'>
                                        Campaign Amount: <span>{lol?.data?.campaign_amount}</span>
                                    </div>

                                </div>
                                <div className="detail-view">
                                    <div className='details'>
                                        Description: <span>{lol?.data?.description}</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div >

    )
}

export default SalesBookingDetails