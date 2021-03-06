package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"time"
	"tohopedia/config"
	"tohopedia/graph/generated"
	"tohopedia/graph/model"
	"tohopedia/helpers"
	"tohopedia/service"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *cartResolver) Product(ctx context.Context, obj *model.Cart) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	if err := db.FirstOrInit(product, "id = ?", obj.ProductID).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&product.CreatedAt)
	helpers.ParseTime(&product.ValidTo)

	return product, nil
}

func (r *cartResolver) User(ctx context.Context, obj *model.Cart) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	if err := db.First(user, "id = ?", obj.UserId).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *mutationResolver) CreateUpdateCart(ctx context.Context, productID string, quantity int, note *string) (*model.Cart, error) {
	db := config.GetDB()
	cart := new(model.Cart)
	product := new(model.Product)
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	err := db.First(cart, "user_id = ? AND product_id = ?", userId, productID).Error

	if len(cart.ID) == 0 {
		loc, _ := time.LoadLocation("Asia/Jakarta")
		now := time.Now().In(loc)
		cart = &model.Cart{
			ID:        uuid.NewString(),
			ProductID: productID,
			UserId:    userId,
			Quantity:  quantity,
			CreatedAt: now,
			Checked:   true,
		}

		err := db.Create(cart).Error

		userPreferences := new(model.UserPreferences)

		product := new(model.Product)

		if err := db.Where("id = ?", productID).Find(&product).Error; err != nil {
			return nil, err
		}

		db.First(userPreferences, "user_id = ? AND category_id = ?", userId, product.CategoryID)

		if len(userPreferences.ID) == 0 {
			userPreferences := &model.UserPreferences{
				ID:         uuid.NewString(),
				UserId:     userId,
				CategoryId: product.CategoryID,
				Score:      1,
			}

			if err := db.Create(&userPreferences).Error; err != nil {
				return nil, err
			}
		} else {
			if err := db.First(userPreferences, "user_id = ? AND category_id = ?", userId, product.CategoryID).Error; err != nil {
				return nil, err
			}

			userPreferences.Score += 3

			if err := db.Save(&userPreferences).Error; err != nil {
				return nil, err
			}
		}

		return cart, err
	} else if err != nil {
		return nil, err
	}

	if err := db.First(product, "id = ?", productID).Error; err != nil {
		return nil, err
	}

	if quantity >= 0 && (cart.Quantity+quantity) <= product.Stock {
		cart.Quantity += quantity
	}

	if err := db.Save(cart).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&cart.CreatedAt)

	return cart, nil
}

func (r *mutationResolver) UpdateCart(ctx context.Context, id string, quantity int) (*model.Cart, error) {
	db := config.GetDB()
	cart := new(model.Cart)
	product := new(model.Product)

	if err := db.First(cart, "id = ?", id).Error; err != nil {
		return nil, err
	}

	if err := db.First(product, "id = ?", cart.ProductID).Error; err != nil {
		return nil, err
	}

	if cart.Quantity > 0 && cart.Quantity <= product.Stock {
		cart.Quantity = quantity
	}

	if err := db.Save(cart).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&cart.CreatedAt)

	return cart, nil
}

func (r *mutationResolver) ToggleCheckCart(ctx context.Context, id string, checked bool) (*model.Cart, error) {
	db := config.GetDB()
	cart := new(model.Cart)

	if err := db.First(cart, "id = ?", id).Error; err != nil {
		return nil, err
	}

	cart.Checked = checked

	if err := db.Save(cart).Error; err != nil {
		return nil, err
	}

	helpers.ParseTime(&cart.CreatedAt)

	return cart, nil
}

func (r *mutationResolver) DeleteCart(ctx context.Context, id string) (*model.Cart, error) {
	db := config.GetDB()
	cart := new(model.Cart)
	if err := db.First(cart, "id = ?", id).Error; err != nil {
		return nil, err
	}
	helpers.ParseTime(&cart.CreatedAt)
	return cart, db.Delete(cart).Error
}

func (r *queryResolver) GetCartProduct(ctx context.Context, productID string) (*model.Cart, error) {
	db := config.GetDB()
	cart := new(model.Cart)

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.First(cart, "product_id = ? AND user_id = ?", productID, userId).Error; err != nil {
		return nil, err
	}

	return cart, nil
}

func (r *queryResolver) GetUserCheckedCart(ctx context.Context) ([]*model.Cart, error) {
	db := config.GetDB()
	var carts []*model.Cart

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}
	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	if err := db.Where("user_id = ? AND checked = ?", userId, true).Find(&carts).Error; err != nil {
		return nil, err
	}

	return carts, nil
}

// Cart returns generated.CartResolver implementation.
func (r *Resolver) Cart() generated.CartResolver { return &cartResolver{r} }

type cartResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *cartResolver) Note(ctx context.Context, obj *model.Cart) (*string, error) {
	panic(fmt.Errorf("not implemented"))
}
