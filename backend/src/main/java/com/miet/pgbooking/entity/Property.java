package com.miet.pgbooking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "excel_id")
    private String excelId;

    @Column(name = "pg_name")
    private String pgName;

    private String city;
    private String locality;
    private String gender;

    @Column(name = "bed_sharing")
    private String bedSharing;

    @Column(name = "price")
    private Double price;

    private Double latitude;
    private Double longitude;

    private String water;
    private String electricity;
    private String wifi;
    private String meal;
    private String ac;
    private String laundry;

    @Column(name = "photo_availability")
    private String photoAvailability;

    @Column(name = "data_status")
    private String dataStatus;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "google_maps_search", columnDefinition = "TEXT")
    private String googleMapsSearch;

    @Column(name = "coordinate_status")
    private String coordinateStatus;

    @Column(name = "room_type")
    private String roomType;

    @Column(name = "food_type")
    private String foodType;

    @Column(name = "meals_included")
    private String mealsIncluded;

    @Column(name = "food_review_comments", columnDefinition = "TEXT")
    private String foodReviewComments;

    @Column(name = "room_cleanliness_rating")
    private Double roomCleanlinessRating;

    @Column(name = "safety_security_rating", columnDefinition = "TEXT")
    private String safetySecurityRating;

    @Column(name = "overall_rating")
    private Double overallRating;

    @Column(name = "review_count")
    private String reviewCount;

    @Column(name = "reviews_comments", columnDefinition = "TEXT")
    private String reviewsComments;

    private String security;
    private String parking;

    @Column(name = "power_backup")
    private String powerBackup;

    @Column(name = "suitable_for")
    private String suitableFor;

    @Column(name = "customer_budget_match", columnDefinition = "TEXT")
    private String customerBudgetMatch;

    @Column(name = "ai_recommendation_notes", columnDefinition = "TEXT")
    private String aiRecommendationNotes;

    @Column(name = "owner_id")
    private Long ownerId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExcelId() {
        return excelId;
    }

    public void setExcelId(String excelId) {
        this.excelId = excelId;
    }

    public String getPgName() {
        return pgName;
    }

    public void setPgName(String pgName) {
        this.pgName = pgName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBedSharing() {
        return bedSharing;
    }

    public void setBedSharing(String bedSharing) {
        this.bedSharing = bedSharing;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getWater() {
        return water;
    }

    public void setWater(String water) {
        this.water = water;
    }

    public String getElectricity() {
        return electricity;
    }

    public void setElectricity(String electricity) {
        this.electricity = electricity;
    }

    public String getWifi() {
        return wifi;
    }

    public void setWifi(String wifi) {
        this.wifi = wifi;
    }

    public String getMeal() {
        return meal;
    }

    public void setMeal(String meal) {
        this.meal = meal;
    }

    public String getAc() {
        return ac;
    }

    public void setAc(String ac) {
        this.ac = ac;
    }

    public String getLaundry() {
        return laundry;
    }

    public void setLaundry(String laundry) {
        this.laundry = laundry;
    }

    public String getPhotoAvailability() {
        return photoAvailability;
    }

    public void setPhotoAvailability(String photoAvailability) {
        this.photoAvailability = photoAvailability;
    }

    public String getDataStatus() {
        return dataStatus;
    }

    public void setDataStatus(String dataStatus) {
        this.dataStatus = dataStatus;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getGoogleMapsSearch() {
        return googleMapsSearch;
    }

    public void setGoogleMapsSearch(String googleMapsSearch) {
        this.googleMapsSearch = googleMapsSearch;
    }

    public String getCoordinateStatus() {
        return coordinateStatus;
    }

    public void setCoordinateStatus(String coordinateStatus) {
        this.coordinateStatus = coordinateStatus;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public String getMealsIncluded() {
        return mealsIncluded;
    }

    public void setMealsIncluded(String mealsIncluded) {
        this.mealsIncluded = mealsIncluded;
    }

    public String getFoodReviewComments() {
        return foodReviewComments;
    }

    public void setFoodReviewComments(String foodReviewComments) {
        this.foodReviewComments = foodReviewComments;
    }

    public Double getRoomCleanlinessRating() {
        return roomCleanlinessRating;
    }

    public void setRoomCleanlinessRating(Double roomCleanlinessRating) {
        this.roomCleanlinessRating = roomCleanlinessRating;
    }

    public String getSafetySecurityRating() {
        return safetySecurityRating;
    }

    public void setSafetySecurityRating(String safetySecurityRating) {
        this.safetySecurityRating = safetySecurityRating;
    }

    public Double getOverallRating() {
        return overallRating;
    }

    public void setOverallRating(Double overallRating) {
        this.overallRating = overallRating;
    }

    public String getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(String reviewCount) {
        this.reviewCount = reviewCount;
    }

    public String getReviewsComments() {
        return reviewsComments;
    }

    public void setReviewsComments(String reviewsComments) {
        this.reviewsComments = reviewsComments;
    }

    public String getSecurity() {
        return security;
    }

    public void setSecurity(String security) {
        this.security = security;
    }

    public String getParking() {
        return parking;
    }

    public void setParking(String parking) {
        this.parking = parking;
    }

    public String getPowerBackup() {
        return powerBackup;
    }

    public void setPowerBackup(String powerBackup) {
        this.powerBackup = powerBackup;
    }

    public String getSuitableFor() {
        return suitableFor;
    }

    public void setSuitableFor(String suitableFor) {
        this.suitableFor = suitableFor;
    }

    public String getCustomerBudgetMatch() {
        return customerBudgetMatch;
    }

    public void setCustomerBudgetMatch(String customerBudgetMatch) {
        this.customerBudgetMatch = customerBudgetMatch;
    }

    public String getAiRecommendationNotes() {
        return aiRecommendationNotes;
    }

    public void setAiRecommendationNotes(String aiRecommendationNotes) {
        this.aiRecommendationNotes = aiRecommendationNotes;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    // Is class me jakar ek baar aur Right-click -> Source Action -> Generate
    // Getters and Setters kar lena
}