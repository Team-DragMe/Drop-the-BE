import { Length } from 'class-validator';
import { PlanOrderRepository } from './../repositories/PlanOrderRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanRepository } from '../repositories/PlanRepository';

@Service()
export class PlanService {
  constructor(
    @InjectRepository() private planRepository: PlanRepository,
    @InjectRepository() private planOrderRepository: PlanOrderRepository,
  ) {}

  public async getPlans(userId: number, type: string, planDate: string) {
    try {
      const totalPlan = await this.planOrderRepository.find({
        where: {
          user_id: userId,
          type,
          planDate,
        },
      });
      if (totalPlan.length == 0) {
        return null;
      }

      const totalPlanList = totalPlan.pop()?.planList as number[];
      switch (type) {
        case 'daily': {
          const plans = await Promise.all(
            totalPlanList.map(async (plan: number) => {
              const data = await this.planRepository.findOne(plan);
              if (!data) {
                return null;
              }
              const result = {
                id: data.id,
                planDate: data.planDate,
                planName: data.planName,
                colorChip: data.colorchip,
                isCompleted: data.isCompleted,
                createdAt: data.createdAt,
              };
              return result;
            }),
          );
          return plans;
        }
        case 'reschedule': {
          const plans = await Promise.all(
            totalPlanList.map(async (plan: number) => {
              const data = await this.planRepository.findOne(plan);
              if (!data) {
                return null;
              }
              const result = {
                id: data.id,
                planDate: data.planDate,
                planName: data.planName,
                colorChip: data.colorchip,
                isCompleted: data.isCompleted,
                createdAt: data.createdAt,
              };
              return result;
            }),
          );
          return plans;
        }
        case 'routine': {
          const plans = await Promise.all(
            totalPlanList.map(async (plan: number) => {
              const data = await this.planRepository.findOne(plan);
              if (!data) {
                return null;
              }
              const result = {
                id: data.id,
                planDate: data.planDate,
                planName: data.planName,
                colorChip: data.colorchip,
                isCompleted: data.isCompleted,
                createdAt: data.createdAt,
              };
              return result;
            }),
          );
          return plans;
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  public async updatePlans(
    userId: number,
    planId: number,
    planName: string,
    colorchip: string,
    planDate: string,
    isCompleted: boolean,
  ) {
    try {
      if (planName) {
        await this.planRepository.update(
          {
            id: planId,
          },
          {
            planName,
          },
        );
      }
      if (colorchip) {
        await this.planRepository.update(
          {
            id: planId,
          },
          {
            colorchip,
          },
        );
      }

      if (isCompleted) {
        await this.planRepository.update(
          {
            id: planId,
          },
          {
            isCompleted,
          },
        );
      }
      //* 우회 취소
      if (planDate) {
        //* 우회할 계획에서 계획블록 섹션으로 옮길 id 찾기
        const reschedulePlan = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: 'reschedule',
          },
        });
        if (reschedulePlan.length == 0) {
          return null;
        }
        let planList = reschedulePlan.pop()?.planList as number[];

        //* planList에 planId에 맞는 계획이 없을 경우 에러처리
        const checkPlanList = planList.includes(planId);

        if (!checkPlanList) {
          return null;
        }
        //* 우회할 planList에서 planId 제거
        const reschedulePlanList = planList.filter((plan) => plan !== planId);

        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: 'reschedule',
          },
          {
            planList: reschedulePlanList,
          },
        );

        //* 계획 블록 planList 찾아내기
        const dailyPlan = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: 'daily',
            planDate,
          },
        });

        if (dailyPlan.length == 0) {
          return null;
        }
        let dailyPlanList = dailyPlan.pop()?.planList as number[];
        //* 계획 블록 섹션에 추가
        dailyPlanList.push(planId);

        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: 'daily',
            planDate,
          },
          {
            planList: dailyPlanList,
          },
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async createPlan(
    userId: number,
    planName: string,
    planDate: string,
    type: string,
  ) {
    try {
      switch (type) {
        case 'daily': {
          let existPlanOrder;

          //* 계획하는 날짜에 planOrder가 있는지 확인
          existPlanOrder = await this.planOrderRepository.find({
            where: {
              user_id: userId,
              type: type,
              planDate,
            },
          });

          if (existPlanOrder.length == 0) {
            //* planOrder가 없다면 그 날의 daily, reschedule planOrder 생성
            const dailyplanOrder = this.planOrderRepository.create({
              user_id: userId,
              type: type,
              planDate,
              planList: [],
            });
            existPlanOrder = [
              await this.planOrderRepository.save(dailyplanOrder),
            ];

            const reschedulePlanOrder = this.planOrderRepository.create({
              user_id: userId,
              type: 'reschedule',
              planDate,
              planList: [],
            });
            await this.planOrderRepository.save(reschedulePlanOrder);
          }

          //* Plan 테이블에 계획 블록 생성
          const planData = this.planRepository.create({
            planName: planName,
            planDate,
            user: {
              id: userId,
            },
            colorchip: 'white',
          });
          const createPlan = await this.planRepository.save(planData);

          //* planOrder에 planId 저장
          let planList = existPlanOrder.pop()?.planList as number[];
          planList.push(createPlan.id);

          //* planOrder를 DB에 업데이트
          await this.planOrderRepository.update(
            {
              user_id: userId,
              type: type,
              planDate,
            },
            {
              planList: planList,
            },
          );

          //* response 반환
          const data = {
            id: createPlan.id,
            planDate: createPlan.planDate,
            planName: createPlan.planName,
            colorchip: createPlan.colorchip,
            planTime: createPlan.planTime,
            fulfilTime: createPlan.fulfillTime,
            type: type,
            isCompleted: createPlan.isCompleted,
            createdAt: createPlan.createdAt,
          };
          return data;
        }
        case 'routine': {
          let existPlanOrder;

          //* 계획하는 날짜에 planOrder가 있는지 확인
          existPlanOrder = await this.planOrderRepository.find({
            where: {
              user_id: userId,
              type: type,
            },
          });
          if (existPlanOrder.length == 0) {
            //* planOrder가 없다면 routine planOrder 생성
            const routinePlanOrder = this.planOrderRepository.create({
              user_id: userId,
              type: type,
              planList: [],
            });
            existPlanOrder = [
              await this.planOrderRepository.save(routinePlanOrder),
            ];
          }

          //* Plan 테이블에 계획 블록 생성
          const planData = await this.planRepository.create({
            planName,
            user: {
              id: userId,
            },
            colorchip: 'white',
          });
          const routinePlan = await this.planRepository.save(planData);

          //* planOrder에 planId 저장
          let planList = existPlanOrder.pop()?.planList as number[];
          planList.push(routinePlan.id);

          //* planOrder를 DB에 업데이트
          await this.planOrderRepository.update(
            {
              user_id: userId,
              type,
            },
            {
              planList,
            },
          );
          const data = {
            id: routinePlan.id,
            planDate: routinePlan.planDate,
            planName: routinePlan.planName,
            colorchip: routinePlan.colorchip,
            planTime: routinePlan.planTime,
            fulfilTime: routinePlan.fulfillTime,
            type: type,
            isCompleted: routinePlan.isCompleted,
            createdAt: routinePlan.createdAt,
          };
          return data;
        }
      }
    } catch (error) {
      throw error;
    }
  }
  public async deletePlans(
    userId: number,
    planId: number,
    type: string,
    planDate: string,
  ) {
    try {
      if (type == 'daily') {
        //* planOrder에 접근하여 planList 가져오기
        const totalPlan = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type,
            planDate,
          },
        });

        //* planList가 비어있을 경우 에러처리
        if (totalPlan.length == 0) {
          return null;
        }

        let planList = totalPlan.pop()?.planList as number[];

        //* planList에 planId에 맞는 계획이 없을 경우 에러처리
        const checkPlanList = planList.includes(planId);

        if (!checkPlanList) {
          return null;
        }
        //* planList에서 planId 제거
        let updatePlanList = planList.filter((plan) => plan !== planId);

        //* planId가 제거된 배열을 DB에 저장
        await this.planOrderRepository.update(
          {
            user_id: userId,
            type,
            planDate,
          },
          {
            planList: updatePlanList,
          },
        );

        //* 마지막으로 plan table에서 계획블록 삭제
        const data = await this.planRepository.delete({
          id: planId,
        });
        return data;
      }

      if (type == 'routine' || 'reschedule') {
        const totalPlan = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type,
          },
        });
        //* planList가 비어있을 경우 에러처리
        if (totalPlan.length == 0) {
          return null;
        }

        let planList = totalPlan.pop()?.planList as number[];

        //* planList에 planId에 맞는 계획이 없을 경우 에러처리
        const checkPlanList = planList.includes(planId);

        if (!checkPlanList) {
          return null;
        }
        //* planList에서 planId 제거
        let updatePlanList = planList.filter((plan) => plan !== planId);

        //* planId가 제거된 배열을 DB에 저장
        await this.planOrderRepository.update(
          {
            user_id: userId,
            type,
          },
          {
            planList: updatePlanList,
          },
        );

        //* 마지막으로 plan table에서 계획블록 삭제
        const data = await this.planRepository.delete({
          id: planId,
        });
        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  public async moveAndChangePlanOrder(
    userId: number,
    to: string,
    from: string,
    planId: number,
    lastArray: number[],
    planDate: string,
  ) {
    try {
      //* 같은 섹션 내 순서 변경
      if (to == from) {
        let changePlanList;
        const findPlanList = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: to,
            planDate,
          },
        });

        changePlanList = findPlanList.pop()?.planList as number[];
        changePlanList = lastArray;

        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: to,
            planDate,
          },
          {
            planList: changePlanList,
          },
        );
      }

      //* 일간 계획, 루틴로드 이동
      if (
        (to == 'daily' && from == 'routine') ||
        (to == 'routine' && from == 'daily')
      ) {
        //* 값을 복사하기 위한 planId 정보 찾기
        const findPlanInfo = await this.planRepository.findOne({
          where: {
            id: planId,
          },
        });
        if (!findPlanInfo) {
          return null;
        }

        //* 계획 블록 복사
        const newPlan = await this.planRepository.create({
          planName: findPlanInfo.planName,
          colorchip: findPlanInfo.colorchip,
          user: {
            id: userId,
          },
          planDate: findPlanInfo.planDate,
        });
        const duplicatePlan = await this.planRepository.save(newPlan);

        //* 최종 배열 수정
        const findPlanIdIndex = lastArray.indexOf(planId);
        lastArray.splice(findPlanIdIndex, 1, duplicatePlan.id);

        //* planList에 최종 배열 업데이트
        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: to,
            planDate,
          },
          {
            planList: lastArray,
          },
        );
      }

      //* 일간계획, 우회할 계획 이동
      if (
        (to == 'daily' && from == 'reschedule') ||
        (to == 'reschedule' && from == 'daily')
      ) {
        if (to == 'reschedule' && from == 'daily')
          //* 우회할 계획으로 이동하는 계획블록 시간 데이터 삭제
          await this.planRepository.update(
            {
              id: planId,
            },
            {
              planTime: [],
              fulfillTime: [],
            },
          );

        let deletePlanList;
        //* 순서 이동 전 planList에서 planId 삭제 후 업데이트
        const findPlanList = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: from,
            planDate,
          },
        });
        deletePlanList = findPlanList.pop()?.planList as number[];
        deletePlanList = deletePlanList.filter((plan) => plan != planId);

        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: from,
            planDate,
          },
          {
            planList: deletePlanList,
          },
        );

        //* 순서 이동 후 planList에 최종 배열 업데이트
        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: to,
            planDate,
          },
          {
            planList: lastArray,
          },
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
