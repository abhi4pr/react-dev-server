import { Link } from "react-router-dom";

export default function OperationCampaigns() {
  return (
    <>
      <div className="card body-padding">
        <div className="header">
          <div className="h3">Master</div>
        </div>
        <div className="card-body">
          {/* <div className="card-header"> Page</div> */}
          <div className="card-body row">
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/brandmaster">
                <div
                  className="card hover body-padding"
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    Brand Master
                  </div>
                </div>
              </Link>
            </div>{" "}
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/overview/agency">
                <div
                  className="card hover body-padding"
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    Agency Master
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/overview/industry">
                <div
                  className="card hover body-padding"
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    Industry Master
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/overview/goal">
                <div
                  className="card hover body-padding"
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    Goal Master
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/contentcreater">
                <div
                  className="card hover body-padding"
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    Commitment Master
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
