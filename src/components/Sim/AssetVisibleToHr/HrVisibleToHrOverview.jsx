import { useState } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import { FcDownload } from "react-icons/fc";
import Swal from "sweetalert2";
import axios from "axios";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const HrVisibleToHrOverview = ({ hrOverviewData, hardRender }) => {
  const { userID } = useAPIGlobalContext();
  const { toastAlert } = useGlobalContext();
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [vendorData, setVendorData] = useState([]);

  const [recoveryRemark, setRecoveryRemark] = useState("");
  const [recoveryImg1, setRecoveryImg1] = useState(null);
  const [recoveryImg2, setRecoveryImg2] = useState(null);
  const [resolvedRemark, setResolvedRemark] = useState("");
  const [scrapRemark, setScrapRemark] = useState("");

  const [repairId, setRepairId] = useState(0);
  const [statusHere, setStatushere] = useState("");

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState("");
  const handleInvoiceImageClick = (imageUrl) => {
    setEnlargedImageUrl(imageUrl);
    setIsInvoiceModalOpen(true);
  };
  const handleInvoiceCloseModal = () => {
    setIsInvoiceModalOpen(false);
    setEnlargedImageUrl("");
  };

  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [showAssetsImage, setShowAssetImages] = useState("");
  const handleImageClick = (row) => {
    setShowAssetImages(row);

    setImageModalOpen(true);
  };
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const handleStatusUpdate = (row, status) => {
    setRepairId(row.repair_id);
    setStatushere(status);
  };
  const handleAcceptUpdate = (row, status) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't Accept This",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Accept it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result) {
          const formData = new FormData();
          formData.append("repair_id", row.repair_id);
          formData.append("status", status);
          formData.append("recovery_remark", recoveryRemark);
          formData.append("scrap_remark", scrapRemark);
          formData.append("recovery_image_upload1", recoveryImg1);
          formData.append("recovery_image_upload2", recoveryImg2);
          formData.append("recovery_by", userID);
          formData.append("accept_by", userID);

          axios.put(baseUrl + "update_repair_request", formData).then((res) => {
            // getRepairRequest();
            toastAlert("Update Success");
            hardRender();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)"
          );
        }
      });
  };

  const handleStatusSubmit = () => {
    const formData = new FormData();
    formData.append("repair_id", repairId);
    formData.append("status", statusHere);
    formData.append("recovery_remark", recoveryRemark);
    formData.append("scrap_remark", scrapRemark);
    formData.append("recovery_image_upload1", recoveryImg1);
    formData.append("recovery_image_upload2", recoveryImg2);
    formData.append("recovery_by", userID);

    axios.put(baseUrl + "update_repair_request", formData).then(() => {
      setRecoveryRemark("");
      setScrapRemark("");
      hardRender();
      toastAlert("Request Success");
    });
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row.status === "Accept" ? (
            <span className="badge badge-success">Accepted</span>
          ) : row.status === "Recover" ? (
            <span className="badge badge-warning">Recoverd</span>
          ) : row.status === "Resolved" ? (
            <span className="badge badge-success">Resolved</span>
          ) : row.status === "Requested" ? (
            <span className="badge badge-danger">Requested</span>
          ) : row.status === "ApprovedByManager" ? (
            <span className="badge badge-warning">Approve By Manager</span>
          ) : null}
        </>
      ),
      width: "170px",
      sortable: true,
    },
    {
      name: "Request By",
      selector: (row) => row.req_by_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Request Date",
      selector: (row) => row.req_date?.split("T")?.[0],
      sortable: true,
      width: "150px",
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },

    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Category",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row.sub_category_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Brand",
      selector: (row) => row.asset_brand_name,
      sortable: true,
    },
    {
      name: "Modal",
      selector: (row) => row.asset_modal_name,
      sortable: true,
    },
    {
      name: "Vendor Name",
      cell: (row) => (
        <>
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleVendorDetails(row.vendor_id)}
          >
            {row.vendor_name}
          </button>
        </>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "img",
      selector: (row) => (
        <button
          className="btn btn-outline-danger"
          onClick={() => handleImageClick(row)}
        >
          <i className="bi bi-images"></i>
        </button>
      ),
    },

    {
      name: "In Warranty",
      selector: (row) => row.inWarranty,
      sortable: true,
    },
    {
      name: "Date Of Purchase",
      selector: (row) => row.dateOfPurchase?.split("T")?.[0],
      sortable: true,
      width: "150px",
    },
    {
      name: "Warranty Date",
      selector: (row) => row.warrantyDate?.split("T")?.[0],
      sortable: true,
      width: "150px",
    },

    {
      name: "Invoice",
      selector: (row) => (
        <>
          <img
            onClick={() => handleInvoiceImageClick(row.invoiceCopy)}
            style={{ width: "100px" }}
            src={row.invoiceCopy}
            alt="invoice copy"
          />
        </>
      ),
      sortable: true,
    },
    {
      name: "invoice Download",
      cell: (row) => (
        <a
          style={{ cursor: "pointer" }}
          target=""
          href={row.invoiceCopy}
          download
        >
          <FcDownload style={{ fontSize: "25px" }} />
        </a>
      ),
      width: "150px",
    },
    (hrOverviewData[0]?.status == "Requested" ||
      hrOverviewData[0]?.status == "ApprovedByManager") && {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleAcceptUpdate(row, "Accept")}
          >
            Accept
          </button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#exampleModal1"
            size="small"
            color="primary"
            className="btn btn-primary btn-sm ml-2"
            onClick={() => handleStatusUpdate(row, "Recover")}
          >
            Recover
          </button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#resolvedModal"
            size="small"
            color="primary"
            onClick={() => handleStatusUpdate(row, "Resolved")}
            className="btn btn-warning btn-sm ml-2"
          >
            Resolve
          </button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#scrapModal"
            size="small"
            color="primary"
            onClick={() => handleStatusUpdate(row)}
            className="btn btn-danger btn-sm ml-2"
          >
            Scrap
          </button>
        </>
      ),
      sortable: true,
      width: "350px",
    },
    hrOverviewData[0]?.status == "Accept" && {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            type="button"
            data-toggle="modal"
            data-target="#exampleModal1"
            size="small"
            color="primary"
            className="btn btn-primary btn-sm ml-2"
            onClick={() => handleStatusUpdate(row, "Recovered")}
          >
            Recover
          </button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#resolvedModal"
            size="small"
            color="primary"
            onClick={() => handleStatusUpdate(row, "Resolved")}
            className="btn btn-warning btn-sm ml-2"
          >
            Resolved
          </button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#scrapModal"
            size="small"
            color="primary"
            onClick={() => handleStatusUpdate(row)}
            className="btn btn-danger btn-sm ml-2"
          >
            Scrap
          </button>
        </>
      ),
      sortable: true,
      width: "350px",
    },
    hrOverviewData[0]?.status == "Recovered" && {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            type="button"
            data-toggle="modal"
            data-target="#resolvedModal"
            size="small"
            color="primary"
            onClick={() => handleStatusUpdate(row, "Resolved")}
            className="btn btn-warning btn-sm ml-2"
          >
            Resolved
          </button>
          <button
            type="button"
            data-toggle="modal"
            data-target="#scrapModal"
            size="small"
            color="primary"
            onClick={() => handleStatusUpdate(row)}
            className="btn btn-danger btn-sm ml-2"
          >
            Scrap
          </button>
        </>
      ),
      sortable: true,
      width: "350px",
    },
  ];
  const handleVendorDetails = async (id) => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_single_vendor/${id}`
      );
      setVendorData([response.data.data]);
      console.log([response.data.data], "data jere");
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Repair Request Overview"
              columns={columns}
              data={hrOverviewData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              exportToCSV
              highlightOnHover
              subHeader
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpenModal}
        onRequestClose={handleModalClose}
        style={{
          content: {
            width: "30%",
            height: "40%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {/* {selectedRow && ( */}
        <div>
          <div className="d-flex justify-content-between mb-2">
            {/* <h2>Department: {selectedRow.dept_name}</h2> */}
            <div className="d-flex">
              <button
                className="btn btn-success float-left mr-5"
                onClick={handleModalClose}
              >
                X
              </button>
              <h3>Vendor Information</h3>
            </div>
          </div>
          {vendorData.map((d, index) => (
            <div
              key={index}
              className="card"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                padding: "20px",
                textAlign: "left",
              }}
            >
              <div className="vendor-details">
                <p>
                  <strong>Vendor Name:</strong> {d.vendor_name}
                </p>
                <p>
                  <strong>Vendor Type:</strong> {d.vendor_type}
                </p>
                <p>
                  <strong>Email:</strong> {d.vendor_email_id}
                </p>
                <p>
                  <strong>Contact No:</strong> {d.vendor_contact_no}
                </p>
                <p>
                  <strong>Secondary Contact No Contact No:</strong>{" "}
                  {d.secondary_contact_no}
                </p>
                <p>
                  <strong>Address:</strong> {d.vendor_address}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* )} */}
      </Modal>

      {/* recover data modal  */}
      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Recover Details
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Recovery Remark"
                Tag="textarea"
                value={recoveryRemark}
                onChange={(e) => setRecoveryRemark(e.target.value)}
                fieldGrid={12}
              />
              <FieldContainer
                label="Recovery IMG 1"
                required={false}
                type="file"
                fieldGrid={12}
                onChange={(e) => setRecoveryImg1(e.target.files[0])}
              />
              <FieldContainer
                label="Recovery IMG 1"
                required={false}
                type="file"
                fieldGrid={12}
                onChange={(e) => setRecoveryImg2(e.target.files[0])}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStatusSubmit}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resolved Remark Modal  */}
      <div
        className="modal fade"
        id="resolvedModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="resolvedModallLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="resolvedModalLabel">
                Resolved Details
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Resolved Remark"
                Tag="textarea"
                value={resolvedRemark}
                onChange={(e) => setResolvedRemark(e.target.value)}
                fieldGrid={12}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStatusSubmit}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrap Remark modal */}
      <div
        className="modal fade"
        id="scrapModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="resolvedModallLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="resolvedModalLabel">
                Scrap Remark
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Scrap Remark"
                Tag="textarea"
                value={scrapRemark}
                onChange={(e) => setScrapRemark(e.target.value)}
                fieldGrid={12}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStatusSubmit}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hanlde image modal  */}
      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Repair Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>
        </div>

        <>
          {/* <h2>Type : {showAssetsImage?.type}</h2> */}
          <div className="summary_cards flex-row row">
            <div
              className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12"
              // onMouseEnter={handleMouseEnter}
              // onMouseLeave={handleMouseLeave}
            >
              <div className="summary_card">
                <div className="summary_cardtitle"></div>
                <div className="summary_cardbody">
                  <div className="summary_cardrow flex-column">
                    <div className="summary_box text-center ml-auto mr-auto"></div>
                    <div className="summary_box col">
                      <img
                        src={showAssetsImage?.img1_url}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="summary_card">
                <div className="summary_cardtitle"></div>
                <div className="summary_cardbody">
                  <div className="summary_cardrow flex-column">
                    <div className="summary_box text-center ml-auto mr-auto"></div>
                    <div className="summary_box col">
                      <img
                        src={showAssetsImage?.img2_url}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="summary_card">
                <div className="summary_cardtitle"></div>
                <div className="summary_cardbody">
                  <div className="summary_cardrow flex-column">
                    <div className="summary_box text-center ml-auto mr-auto"></div>
                    <div className="summary_box col">
                      <img
                        src={showAssetsImage?.img3_url}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="summary_card">
                <div className="summary_cardtitle"></div>
                <div className="summary_cardbody">
                  <div className="summary_cardrow flex-column">
                    <div className="summary_box text-center ml-auto mr-auto"></div>
                    <div className="summary_box col">
                      <img
                        src={showAssetsImage?.img4_url}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </Modal>

      {/* invoice modsal here  */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onRequestClose={handleInvoiceCloseModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            // marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <img
          src={enlargedImageUrl}
          alt="Enlarged Image"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </Modal>
    </>
  );
};

export default HrVisibleToHrOverview;
