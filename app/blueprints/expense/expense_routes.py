from flask.helpers import make_response, request
from .import bp as api
from app import db
from sqlalchemy.sql import func
from flask import make_response, g
from app.models import Category, User, Income, Expense
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth


basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(username, password):
    u = User.query.filter_by(username = username).first()
    if u is None:
        return False
    g.current_user = u
    return u.check_hashed_password(password)


@token_auth.verify_token
def verify_token(token):
    u = User.check_token(token) if token else None
    g.current_user = u
    return g.current_user or None


#################################################################################################
#                               Category APIs
#################################################################################################

@api.get("/category")
def get_categories():
    return make_response({"category":[cat.to_dict() for cat in Category.query.all()]}, 200)

@api.get("/category/<int:id>")
def get_category(id):
    return make_response(Category.query.get(id).to_dict(), 200)

@api.post("/category")
def post_category():
    data = request.get_json()
    new_cat = Category()
    new_cat.from_dict(data)
    new_cat.save()
    return make_response("Category created", 200)

@api.put("/category/<int:id>")
def put_category(id):
    data = request.get_json()
    cat = Category.query.get(id)
    cat.from_dict(data)
    cat.save()
    return make_response("Category modified", 200)

@api.delete("/category/<int:id>")
def delete_category(id):
    Category.query.get(id).delete()
    return make_response("Category deleted", 200)

#################################################################################################
#                               Income APIs
#################################################################################################

@api.get("/income")
def get_incomes():
    return make_response({"incomes":[income.to_dict() for income in Income.query.all()]}, 200)

@api.get("/income/<int:id>")
def get_income(id):
    return make_response(Income.query.get(id).to_dict(), 200)
    

# @api.get("/income/user/<int:user_id>")
# def get_incomeforuser(user_id):
#     all_incomes = Income.query.filter_by(user_id = user_id).all()
#     incomes = [income.to_dict() for income in all_incomes]
#     return make_response({"incomes":incomes}, 200)
    

# @api.get("/income/month/<string:month>")
# def get_incomebymonth(month):
#     return make_response(Income.query.filter_by(month=month).first().to_dict(), 200)

# main chart
# @api.get("/income/user/<int:user_id>")
# def get_incomebymonth(user_id):
#     return make_response(Income.query.filter_by(user_id=user_id).first().to_dict(), 200)

@api.post("/income")
def post_income():
    data = request.get_json()
    new_income = Income()
    new_income.from_dict(data)
    new_income.save()
    return make_response("Income created", 200)

@api.get("/income/user/<int:id>")
def get_incomebyuser(id):
    all_incomes = Income.query.filter_by(user_id = id).all()
    incomes = [income.to_dict() for income in all_incomes]
    return make_response({"incomes":incomes}, 200)

@api.put("/income/<int:id>")
def put_income(id):
    data = request.get_json()
    income = Income.query.get(id)
    income.from_dict(data)
    income.save()
    return make_response("Income modified", 200)

@api.delete("/income/<int:id>")
def delete_income(id):
    Income.query.get(id).delete()
    return make_response("Income deleted")
    
#################################################################################################
#                               Expense APIs
#################################################################################################

@api.get("/expense")
def get_expenses():
    return make_response({"expenses":[expense.to_dict() for expense in Expense.query.all()]}, 200)

@api.get("/expense/<int:id>")
def get_expense(id):
    return make_response(Expense.query.get(id).to_dict(), 200)

@api.get("/expense/user/<int:id>")
def get_expensebyuser(id):
    all_expenses = Expense.query.filter_by(user_id = id).all()
    expenses = [expense.to_dict() for expense in all_expenses]
    return make_response({"expenses":expenses}, 200)

@api.get("/expense/month/<string:month>")
def get_expensebymonth(month):
    all_expenses = Expense.query.filter_by(month = month).all()
    expenses = [expense.to_dict() for expense in all_expenses]
    return make_response({"expenses":expenses}, 200)

@api.get("/expense/category/<int:id>/user/<int:userid>")
def get_expensebycategory(userid, id):
    # all_expenses = Expense.query.filter((Expense.category_id = id) & (Expense.user_id = userid)).all()
    all_expenses = Expense.query.filter_by(category_id = id , user_id = userid).all()
    expenses = [expense.to_dict() for expense in all_expenses]
    return make_response({"expenses":expenses}, 200)


@api.get("/expense/user/<int:userid>/chart")
def get_expensebyuserforchartdata(userid):
    # all_expenses = Expense.query.filter((Expense.category_id = id) & (Expense.user_id = userid)).all()
    # all_expenses = Expense.query.filter_by(user_id = userid).group_by(Expense.category_id).all()


    all_expenses = db.session.query(Expense.month, db.func.sum(Expense.amount).label('amount')).group_by(Expense.month).filter_by(user_id = userid).all()
    # expenses = [expense.to_dict() for expense in all_expenses]
    # return make_response(str(all_expenses), 200)
    return make_response({"expenses": str(all_expenses)}, 200)


#main chart    
@api.get("/expense/category/user/<int:userid>")
def get_expensebycategorybyuser(userid):
    # all_expenses = Expense.query.filter_by(user_id = userid).group_by(Expense.category_id).all()
    all_expenses = db.session.query(Expense.category_id, db.func.sum(Expense.amount).label('amount')).group_by(Expense.category_id).filter_by(user_id = userid).all()
    return make_response({"expenses": str(all_expenses)}, 200)
   

@api.post("/expense")
def post_expense():
    data = request.get_json()
    new_expense = Expense()
    new_expense.from_dict(data)
    new_expense.save()
    return make_response("Expense created", 200)

@api.put("/expense/<int:id>")
def put_expense(id):
    data = request.get_json()
    expense = Expense.query.get(id)
    expense.from_dict(data)
    expense.save()
    return make_response("Expense modified", 200)

@api.delete("/expense/<int:id>")
def delete_expense(id):
    Expense.query.get(id).delete()
    return make_response("Expense deleted")