import React, { useEffect, useState } from 'react'
import { useGetSingleDocumentOverviewTypeQuery } from '../../../../Store/API/Sales/DocumentTypeOverview';
import { useGetAllDocumentTypeQuery, useGetSingleDocumentTypeQuery } from '../../../../Store/API/Sales/DocumentTypeApi';


const DocumentTypDetails = ({ SingleAccount, SingleAccountLoading }) => {
    const [documentId, setDocumentId] = useState(null);
    const { data: DocumentTypeData, isLoading: DocumentTypeLoading, error: DocumentTypeError } = useGetSingleDocumentOverviewTypeQuery(documentId);
    const { data: AllDocumentTypeData, isLoading: AllDocumentTypeLoading, error: AllDocumentTypeError } = useGetAllDocumentTypeQuery();

    useEffect(() => {
        if (!SingleAccountLoading) {
            setDocumentId(SingleAccount?.account_id + '?_id=false');
        }
    }, [SingleAccount])


    return (
        <div className='DocDetails'>
            <h2 className='mb-4' style={{ color: "var(--medium)" }}>Documents</h2>
            <div className="row">

                {DocumentTypeData?.data?.map((document, index) => (
                    <div key={index} class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">

                        <div className="card w-100">
                            <div className="card-header">
                                <h4 className='card-title'>{
                                    AllDocumentTypeData?.find(
                                        doc => doc._id === document.document_master_id

                                    )?.document_name}</h4>
                            </div>
                            <div className="card-body">
                                <div className="account-detail">
                                    <div className="detail-view">
                                        <div className='details'>
                                            <img className='DocImage' onError={(e) => { e.target.onerror = null; e.target.src = "/error.jpg"; }} src={DocumentTypeData?.imageUrl + document?.document_image_upload} alt="" />
                                        </div>

                                    </div>
                                    <div className="detail-view">
                                        <div className='details'>
                                            Description: <span>{document.description}</span>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default DocumentTypDetails