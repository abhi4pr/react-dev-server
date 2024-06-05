import React, { useState, useEffect } from "react";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import FieldContainer from "../../FieldContainer";
import { useGetSingleSaleServiceQuery } from "../../../Store/API/Sales/SalesServiceApi";
import { set } from "date-fns";

const RecordServices = ({ records, setRecords, serviceTypes }) => {
  const [selectedRecords, setSelectedRecords] = useState(records.map(() => ""));
  const [recordId, setRecordId] = useState();
  const [indexMain, setindexMain] = useState(0);
  const [serviceFieldsData, setServiceFieldsData] = useState([]);
  const [recordLen, setRecordLen] = useState(serviceFieldsData.length);
  const [justDeleted, setJustDeleted] = useState(false);
  const {
    data: saleServiceData,
    error: saleServiceError,
    isLoading: saleServiceLoading,
  } = useGetSingleSaleServiceQuery(recordId, { skip: !recordId });

  // const serviceFieldsData = selectedRecords.map(
  //   (selectedRecord) => useGetSingleSaleServiceQuery(selectedRecord).data
  // );

  useEffect(() => {
    if (!saleServiceLoading) {
      setRecordId(selectedRecords[indexMain - 1]);
      if (!justDeleted) {
        (serviceFieldsData.length < recordLen) ?
          setindexMain(indexMain - 1)
          : setindexMain(indexMain + 1);
      } else {
        setJustDeleted(false);
      }
    }
    setRecordLen(serviceFieldsData.length);
  }, [selectedRecords]);
  useEffect(() => {
    if (saleServiceData && !saleServiceLoading) {
      setServiceFieldsData(prevServiceFieldsData => [...prevServiceFieldsData, saleServiceData]);

    }
  }, [saleServiceData])


  const handleRecordChange = (index, key, value) => {
    const updatedRecords = records?.map((record, recordIndex) =>
      recordIndex === index ? { ...record, [key]: value } : record
    );
    setRecords(updatedRecords);

    if (key === "type") {
      const updatedSelectedRecords = [...selectedRecords];
      updatedSelectedRecords[index] = value;
      setSelectedRecords(updatedSelectedRecords);
    }
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = [...records];
    updatedRecords.splice(index, 1);
    setRecords(updatedRecords);
    const updatedSelectedRecords = [...selectedRecords];
    updatedSelectedRecords.splice(index, 1);
    setSelectedRecords(updatedSelectedRecords);
    const updatedServiceFieldsData = [...serviceFieldsData];
    updatedServiceFieldsData.splice(index, 1);
    setServiceFieldsData(updatedServiceFieldsData);
    setindexMain(indexMain - 1);
    setJustDeleted(true);
  };

  const getAvailableServiceTypes = (currentIndex) => {
    const selectedTypes = records.map((record) => record.type)?.filter(Boolean);
    return serviceTypes?.filter(
      (type) =>
        !selectedTypes.includes(type._id) ||
        records[currentIndex].type === type._id
    );
  };

  return (
    <>
      {records?.map((record, index) => {
        const ServiceFields = serviceFieldsData[index];

        return (
          <div className="card" key={index}>
            <div className="card-header">
              <h4>Record {index + 1}</h4>
              <button
                className="btn cmnbtn btn-danger"
                onClick={() => handleDeleteRecord(index)}
              >
                Delete
              </button>
            </div>
            <div className="card-body">
              <div className="row record-container">
                <CustomSelect
                  label="Service Type"
                  fieldGrid={6}
                  dataArray={getAvailableServiceTypes(index)}
                  optionId="_id"
                  optionLabel="service_name"
                  selectedId={record.type}
                  setSelectedId={(value) =>
                    handleRecordChange(index, "type", value)
                  }
                  required
                />

                {ServiceFields?.indiviual_amount_status && (
                  <FieldContainer
                    label="Amount"
                    placeholder="Enter Amount"
                    type="number"
                    fieldGrid={6}
                    value={record.amount || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "amount", e.target.value)
                    }
                    required
                  />
                )}
                {ServiceFields?.no_of_hours_status && (
                  <FieldContainer
                    label="Number of Hours"
                    placeholder="Enter Number of Hours"
                    type="number"
                    fieldGrid={6}
                    value={record.no_of_hours || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "no_of_hours", e.target.value)
                    }
                    required
                  />
                )}

                {ServiceFields?.goal_status && (
                  <FieldContainer
                    label="Goal"
                    placeholder="Enter Goal"
                    type="text"
                    fieldGrid={6}
                    value={record.goal || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "goal", e.target.value)
                    }
                    required
                  />
                )}
                {ServiceFields?.day_status && (
                  <FieldContainer
                    label="Day"
                    placeholder="Enter Day"
                    type="number"
                    fieldGrid={6}
                    value={record.day || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "day", e.target.value)
                    }
                    required
                  />
                )}

                {ServiceFields?.quantity_status && (
                  <FieldContainer
                    label="Quantity"
                    placeholder="Enter Quantity"
                    type="number"
                    fieldGrid={6}
                    value={record.quantity || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "quantity", e.target.value)
                    }
                    required
                  />
                )}

                {ServiceFields?.brand_name_status && (
                  <FieldContainer
                    label="Brand Name"
                    placeholder="Enter Brand Name"
                    type="text"
                    fieldGrid={6}
                    value={record.brand_name || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "brand_name", e.target.value)
                    }
                    required
                  />
                )}

                {ServiceFields?.hashtag && (
                  <FieldContainer
                    label="Hashtag"
                    placeholder="Enter Hashtag"
                    type="text"
                    fieldGrid={6}
                    value={record.hashtag || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "hashtag", e.target.value)
                    }
                    required
                  />
                )}

                {ServiceFields?.indiviual_amount_status && (
                  <FieldContainer
                    label="Individual Amount"
                    placeholder="Enter Individual Amount"
                    type="number"
                    fieldGrid={6}
                    value={record.individual_amount || ""}
                    onChange={(e) =>
                      handleRecordChange(
                        index,
                        "individual_amount",
                        e.target.value
                      )
                    }
                    required
                  />
                )}

                {ServiceFields?.start_end_date_status && (
                  <FieldContainer
                    label="Start Date"
                    placeholder="Enter Start Date"
                    type="date"
                    fieldGrid={6}
                    value={
                      record.start_date ? record.start_date.split("T")[0] : ""
                    }
                    onChange={(e) =>
                      handleRecordChange(index, "start_date", e.target.value)
                    }
                    required
                  />
                )}

                {ServiceFields?.start_end_date_status && (
                  <FieldContainer
                    label="End Date"
                    placeholder="Enter End Date"
                    type="date"
                    fieldGrid={6}
                    value={record.end_date ? record.end_date.split("T")[0] : ""}
                    onChange={(e) =>
                      handleRecordChange(index, "end_date", e.target.value)
                    }
                    required
                  />
                )}

                {ServiceFields?.per_month_amount_status && (
                  <FieldContainer
                    label="Per Month Amount"
                    placeholder="Enter Per Month Amount"
                    type="number"
                    fieldGrid={6}
                    value={record.per_month_amount || ""}
                    onChange={(e) =>
                      handleRecordChange(
                        index,
                        "per_month_amount",
                        e.target.value
                      )
                    }
                    required
                  />
                )}

                {ServiceFields?.no_of_creators && (
                  <FieldContainer
                    label="Number of Creators"
                    placeholder="Enter Number of Creators"
                    type="number"
                    fieldGrid={6}
                    value={record.no_of_creators || ""}
                    onChange={(e) =>
                      handleRecordChange(
                        index,
                        "no_of_creators",
                        e.target.value
                      )
                    }
                    required
                  />
                )}

                {ServiceFields?.deliverables_info && (
                  <FieldContainer
                    label="Deliverables Info"
                    placeholder="Enter Deliverables Info"
                    type="text"
                    fieldGrid={6}
                    value={record.deliverables_info || ""}
                    onChange={(e) =>
                      handleRecordChange(
                        index,
                        "deliverables_info",
                        e.target.value
                      )
                    }
                    required
                  />
                )}

                {ServiceFields?.remarks && (
                  <FieldContainer
                    label="Remarks"
                    placeholder="Enter Remarks"
                    type="text"
                    fieldGrid={6}
                    value={record.remarks || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "remarks", e.target.value)
                    }
                    required
                  />
                )}

                {ServiceFields?.is_excel_upload && (
                  <FieldContainer
                    label="Excel Upload"
                    placeholder="Enter Excel Upload"
                    type="file"
                    fieldGrid={6}
                    onChange={(e) =>
                      handleRecordChange(
                        index,
                        "excel_upload",
                        e.target.files[0]
                      )
                    }
                    required
                  />
                )}

                {record.excel_upload_url && (
                  <div className="col-6">
                    <label>Uploaded File</label>
                    <a
                      href={record.excel_upload_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RecordServices;
