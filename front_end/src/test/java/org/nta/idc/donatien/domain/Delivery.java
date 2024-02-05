package org.nta.idc.donatien.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.nta.idc.donatien.domain.enumeration.DeliveryStatuses;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Delivery.
 */
@Table("delivery")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Delivery implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("receiver_client_id")
    private Long receiverClientId;

    @NotNull(message = "must not be null")
    @Column("deliverer_id")
    private Long delivererId;

    @NotNull(message = "must not be null")
    @Column("order_number")
    private Long orderNumber;

    @Column("delivery_note")
    private String deliveryNote;

    @Column("delivery_date")
    private ZonedDateTime deliveryDate;

    @Column("delivery_address")
    private String deliveryAddress;

    @NotNull(message = "must not be null")
    @Column("status")
    private DeliveryStatuses status;

    @Transient
    @JsonIgnoreProperties(value = { "jobCards", "deliveries", "client", "assignedToEmployee", "division" }, allowSetters = true)
    private ClientReceptionOrder receiptionOrder;

    @Transient
    @JsonIgnoreProperties(value = { "organization", "deliveries" }, allowSetters = true)
    private Attachment document;

    @Transient
    @JsonIgnoreProperties(
        value = { "clients", "childreens", "organizations", "persons", "deliveries", "parent", "level" },
        allowSetters = true
    )
    private Location location;

    @Column("receiption_order_id")
    private Long receiptionOrderId;

    @Column("document_id")
    private Long documentId;

    @Column("location_id")
    private Long locationId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Delivery id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReceiverClientId() {
        return this.receiverClientId;
    }

    public Delivery receiverClientId(Long receiverClientId) {
        this.setReceiverClientId(receiverClientId);
        return this;
    }

    public void setReceiverClientId(Long receiverClientId) {
        this.receiverClientId = receiverClientId;
    }

    public Long getDelivererId() {
        return this.delivererId;
    }

    public Delivery delivererId(Long delivererId) {
        this.setDelivererId(delivererId);
        return this;
    }

    public void setDelivererId(Long delivererId) {
        this.delivererId = delivererId;
    }

    public Long getOrderNumber() {
        return this.orderNumber;
    }

    public Delivery orderNumber(Long orderNumber) {
        this.setOrderNumber(orderNumber);
        return this;
    }

    public void setOrderNumber(Long orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getDeliveryNote() {
        return this.deliveryNote;
    }

    public Delivery deliveryNote(String deliveryNote) {
        this.setDeliveryNote(deliveryNote);
        return this;
    }

    public void setDeliveryNote(String deliveryNote) {
        this.deliveryNote = deliveryNote;
    }

    public ZonedDateTime getDeliveryDate() {
        return this.deliveryDate;
    }

    public Delivery deliveryDate(ZonedDateTime deliveryDate) {
        this.setDeliveryDate(deliveryDate);
        return this;
    }

    public void setDeliveryDate(ZonedDateTime deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public Delivery deliveryAddress(String deliveryAddress) {
        this.setDeliveryAddress(deliveryAddress);
        return this;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public DeliveryStatuses getStatus() {
        return this.status;
    }

    public Delivery status(DeliveryStatuses status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(DeliveryStatuses status) {
        this.status = status;
    }

    public ClientReceptionOrder getReceiptionOrder() {
        return this.receiptionOrder;
    }

    public void setReceiptionOrder(ClientReceptionOrder clientReceptionOrder) {
        this.receiptionOrder = clientReceptionOrder;
        this.receiptionOrderId = clientReceptionOrder != null ? clientReceptionOrder.getId() : null;
    }

    public Delivery receiptionOrder(ClientReceptionOrder clientReceptionOrder) {
        this.setReceiptionOrder(clientReceptionOrder);
        return this;
    }

    public Attachment getDocument() {
        return this.document;
    }

    public void setDocument(Attachment attachment) {
        this.document = attachment;
        this.documentId = attachment != null ? attachment.getId() : null;
    }

    public Delivery document(Attachment attachment) {
        this.setDocument(attachment);
        return this;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
        this.locationId = location != null ? location.getId() : null;
    }

    public Delivery location(Location location) {
        this.setLocation(location);
        return this;
    }

    public Long getReceiptionOrderId() {
        return this.receiptionOrderId;
    }

    public void setReceiptionOrderId(Long clientReceptionOrder) {
        this.receiptionOrderId = clientReceptionOrder;
    }

    public Long getDocumentId() {
        return this.documentId;
    }

    public void setDocumentId(Long attachment) {
        this.documentId = attachment;
    }

    public Long getLocationId() {
        return this.locationId;
    }

    public void setLocationId(Long location) {
        this.locationId = location;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Delivery)) {
            return false;
        }
        return getId() != null && getId().equals(((Delivery) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Delivery{" +
            "id=" + getId() +
            ", receiverClientId=" + getReceiverClientId() +
            ", delivererId=" + getDelivererId() +
            ", orderNumber=" + getOrderNumber() +
            ", deliveryNote='" + getDeliveryNote() + "'" +
            ", deliveryDate='" + getDeliveryDate() + "'" +
            ", deliveryAddress='" + getDeliveryAddress() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
