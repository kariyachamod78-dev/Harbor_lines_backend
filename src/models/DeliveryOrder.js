// backend/models/DeliveryOrder.js
import mongoose from 'mongoose';

const hsCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true }
});

const containerDetailSchema = new mongoose.Schema({
  containerNo: { type: String, required: true },
  containerType: String,
  grossWeight: Number,
  noOfPackages: Number,
  soc: { type: Boolean, default: false },
  agent: String,
  deposit: { type: Boolean, default: false },
  serialNo: String,
  fclType: { type: String, enum: ['20 FT', '40 FT', 'Over 40 FT'] }
});

const fclContainerSchema = new mongoose.Schema({
  type: String,
  count: Number
});

const deStuffContainerSchema = new mongoose.Schema({
  type: String,
  count: Number
});

const deliveryOrderSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'SeaImportJob', required: true },
  jobNum: { type: String, required: true },

  // Job Information
  houseBl: { type: String, required: true },
  masterBlNumber: String,
  masterBlSerial: String,
  houseBlSerial: String,
  doType: { type: String, enum: ['Custom Copy', 'SLPA 1', 'SLPA 2', 'SLPA 3'], required: true },
  deStuffRequired: { type: Boolean, default: false },

  // Main Details - Optional refs (removed required)
  portOfLoadingId: { type: mongoose.Schema.Types.ObjectId, ref: 'SeaDestination' },
  portOfLoadingName: String,
  portOfLoadingCode: String,

  originAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerSupplier' },
  originAgentName: String,
  originAgentCode: String,

  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerSupplier' },
  carrierName: String,
  carrierCode: String,

  consigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerSupplier', required: true },
  consigneeCode: String,
  consigneeName: String,
  consigneeAddress: String,
  consigneeStreet: String,
  consigneeCountry: String,

  shipperId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerSupplier', required: true },
  shipperCode: String,
  shipperName: String,
  shipperAddress: String,
  shipperStreet: String,
  shipperCountry: String,

  notifyPartyEnabled: { type: Boolean, default: false },
  notifyPartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerSupplier' },
  notifyPartyCode: String,
  notifyPartyName: String,
  notifyPartyAddress: String,
  notifyPartyStreet: String,
  notifyPartyCountry: String,

  doExpiresOn: { type: Date, required: true },
  displayDoExpires: { type: Boolean, default: false },
  dangerousCargoDays: Number,
  dangerousCargoGroup: String,
  dateOfLanding: Date,

  deStuffContainers: [deStuffContainerSchema],
  fclContainers: [fclContainerSchema],

  noOfPackages: Number,
  packageTypeCode: String,
  packageTypeName: String,
  noOfPackagesWords: String,

  masterBlCollectDate: Date,
  masterBlCollectEnabled: { type: Boolean, default: false },
  docReleaseDate: Date,
  docReleaseEnabled: { type: Boolean, default: false },

  remarks: String,
  mainLine: String,
  tinNoOwner: String,
  revenueType: { type: String, enum: ['Nomination', 'Free Hand'], default: 'Nomination' },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  salesmanName: String,
  salesmanCode: String,

  // Sub Details
  marksNumbers: String,
  description: String,
  grossWeight: Number,
  cbm: Number,
  blType: { type: String, enum: ['House BL', 'Master BL'], default: 'House BL' },
  commodity: { type: String, default: 'General Cargo' },
  freightTerm: String,
  hblTerm: String,
  rateFom: String,
  emptyReturn: String,
  terminal: String,
  placeOfReceipt: String,
  hsCodes: [hsCodeSchema],

  // Company Details (static)
  companyCode: String,
  companyName: String,
  companyAddress: String,
  companyCity: String,
  companyCountry: String,
  companyTel1: String,
  companyTel2: String,

  // Container Details
  containerDetails: [containerDetailSchema],

  // Auto-generated
  doNum: { type: String, unique: true },
  agentDoNo: { type: Number, unique: true },

  status: { type: String, enum: ['Draft', 'Submitted', 'Approved'], default: 'Draft' }
}, { timestamps: true });

// Auto-generate DO Number and Agent DO No
deliveryOrderSchema.pre('save', async function(next) {
  // No longer generating doNum here, handled in controller
  
  if (!this.agentDoNo) {
    const lastDO = await this.constructor.findOne({}, { agentDoNo: 1 }, { sort: { agentDoNo: -1 } });
    this.agentDoNo = lastDO && lastDO.agentDoNo ? lastDO.agentDoNo + 1 : 1746;
  }
  next();
});

// Optional: Clean empty ObjectId strings before save
deliveryOrderSchema.pre('save', function(next) {
  const objectIdFields = [
    'portOfLoadingId',
    'originAgentId',
    'carrierId',
    'notifyPartyId'
  ];

  objectIdFields.forEach(field => {
    if (this[field] === '' || this[field] === null || this[field] === undefined) {
      this[field] = undefined;
    }
  });

  // Clean empty strings in containerDetails to avoid enum validation errors
  if (this.containerDetails && Array.isArray(this.containerDetails)) {
    this.containerDetails.forEach(detail => {
      if (detail.fclType === '') {
        detail.fclType = undefined;
      }
    });
  }

  next();
});

export default mongoose.model('DeliveryOrder', deliveryOrderSchema);