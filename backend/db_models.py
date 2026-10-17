from sqlalchemy import Column, Integer, String, Float, JSON
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    features = Column(JSON)
    prediction = Column(String)
    cnn_prob = Column(Float)
    lstm_prob = Column(Float)
    transformer_prob = Column(Float)