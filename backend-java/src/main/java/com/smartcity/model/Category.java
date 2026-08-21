package com.smartcity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @NotBlank
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @NotBlank
    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "icon", length = 50)
    private String icon = "fa-map-marker-alt";

    @Column(name = "description")
    private String description;

    public Category() {}

    public Category(String name, String code, String icon, String description) {
        this.name = name;
        this.code = code;
        this.icon = icon;
        this.description = description;
    }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
